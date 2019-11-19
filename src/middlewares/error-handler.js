import errors from '../utils/errors';

const isProd = process.env.NODE_ENV === 'production';

// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
    let error;
    if (!err) {
        error = new errors.InternalServerError('Internal server api error!');
    } else {
        error = errors.convert(err);
    }
    const output = Object.assign({}, error.toJSON());
    if (isProd) {
        delete output.stack;
    }
    res.set('Content-Type', 'application/json');
    res.status(error.status).json(output);
    return next();
}
