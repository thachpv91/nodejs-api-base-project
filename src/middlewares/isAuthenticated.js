
import errors from '../utils/errors';
import appErrors from '../app-errors';
const isProd = process.env.NODE_ENV === 'production';

// eslint-disable-next-line no-unused-vars
export default function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    next(new errors.NotAuthenticated(appErrors.LOGIN_REQUIRED));
}
