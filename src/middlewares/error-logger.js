/**
 * Error handler for api routes
 */
import config from 'config';
import Raven from 'raven';
import PrettyError from 'pretty-error';

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

// eslint-disable-next-line no-unused-vars
export default function errorLogger(err, req, res, next) {
    const ravenConfig = config.get("raven");
    if (isProd && ravenConfig && ravenConfig.enable){
        const raven = new Raven.Client(ravenConfig.client_id);
        raven.captureException(err);
    }

    if (isDev) {
        const pe = new PrettyError();
        pe.skipNodeFiles();
        pe.skipPackage('express');

        // eslint-disable-next-line no-console
        console.log(pe.render(err));
    }
    return next(err);
}
