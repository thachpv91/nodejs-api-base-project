/**
 * API Routes
 */

import { Router } from 'express';
import validate  from 'express-validation';
import errors from '../utils/errors';

import appErrors from '../app-errors';
import AuthController, { validation as authValidation} from "../controllers/auth.controller";
import UserController from "../controllers/user.controller";
import { authLocal, authJwt } from '../services/auth.service';


const routes = Router();

routes.get('/', (_, res) => res.json({ "message": "Welcome to the API v1" }));

routes.post('/auth/register', AuthController.register);
routes.post('/auth/sign-in', validate(authValidation.login), authLocal , AuthController.login);
routes.get('/user/info', authJwt, UserController.getUserInfo);
routes.get('/user/wallets', authJwt, UserController.getUserWallets);

routes.all('*', (req, res, next) => {
    next(new errors.NotFound(appErrors.API_NOT_FOUND))
});

export default routes;
