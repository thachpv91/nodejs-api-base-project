/* eslint-disable no-param-reassign */
import path from 'path';
import validate from 'express-validation';
import errors from '../utils/errors';
import appErrors from '../app-errors';

const defaults = {
    public: path.resolve(__dirname, 'public'),
    logger: null,
};

const defaultHtmlError = path.resolve(defaults.public, 'default.html');
const isProd = process.env.NODE_ENV === 'production';

export default function errorHandler(opts = {}) {
    const options = Object.assign({}, defaults, opts);
    if (typeof options.html === 'undefined') {
        options.html = {
            401: path.resolve(options.public, '401.html'),
            404: path.resolve(options.public, '404.html'),
            default: defaultHtmlError,
        };
    }

    if (typeof options.json === 'undefined') {
        options.json = {};
    }

    return function(error, req, res, next) {
        // Set the error code for HTTP processing semantics
        error.status = !isNaN(parseInt(error.status, 10))
            ? parseInt(error.status, 10)
            : 500;

        // Log the error if it didn't come from a service method call
        if (
            options.logger &&
            typeof options.logger.error === 'function'
        ) {
            if (error.status >= 500) {
                options.logger.error(error);
            } else {
                options.logger.info(error);
            }
        }
        if (error.type !== 'ExtendableError') {
            const oldError = error;
            if (error instanceof validate.ValidationError) {
                error = new errors.ValidationError(error, {
                    errors: error.errors,
                });
            } else {
                error = new errors.GeneralError(appErrors.GENERAL_ERROR, {
                    errors: oldError.errors,
                });
            }
            if (oldError.stack) {
                error.stack = oldError.stack;
            }
        }

        const formatter = {};

        // If the developer passed a custom function for ALL html errors
        if (typeof options.html === 'function') {
            formatter['text/html'] = options.html;
        } else {
            let file = options.html[error.code];
            if (!file) {
                file = options.html.default || defaultHtmlError;
            }
            // If the developer passed a custom function for individual html errors
            if (typeof file === 'function') {
                formatter['text/html'] = file;
            } else {
                formatter['text/html'] = function() {
                    res.set('Content-Type', 'text/html');
                    res.sendFile(file);
                };
            }
        }

        // If the developer passed a custom function for ALL json errors
        if (typeof options.json === 'function') {
            formatter['application/json'] = options.json;
        } else {
            const handler = options.json[error.status] || options.json.default;
            // If the developer passed a custom function for individual json errors
            if (typeof handler === 'function') {
                formatter['application/json'] = handler;
            } else {
                // Don't show stack trace if it is a 404 error
                if (error.status === 404) {
                    error.stack = null;
                }

                formatter['application/json'] = function() {
                    const output = Object.assign({}, error.toJSON());

                    if (isProd) {
                        delete output.stack;
                    }

                    res.set('Content-Type', 'application/json');
                    res.json(output);
                };
            }
        }

        res.status(error.status);
        const contentType = req.headers['content-type'] || 'json';
        const accepts = req.headers.accept || '';

        // by default just send back json
        if (
            contentType.indexOf('json') !== -1 ||
            accepts.indexOf('json') !== -1
        ) {
            formatter['application/json'](error, req, res, next);
        } else if (
            options.html &&
            (contentType.indexOf('html') !== -1 ||
                accepts.indexOf('html') !== -1)
        ) {
            formatter['text/html'](error, req, res, next);
        } else {
            // TODO (EK): Maybe just return plain text
            formatter['application/json'](error, req, res, next);
        }
    };
}
