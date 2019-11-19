/* eslint-disable no-unused-vars */
/**
 * Authentication controller
 */
import HTTPStatus from 'http-status';
import Joi from 'joi';
import UserService from '../services/user.service';
import errors from '../utils/errors';
import { appEvent , EVENTS } from '../event';

export const validation = {
  login: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
    },
  },
};

class AuthController {

    register(req, res, next){
        appEvent.emit(EVENTS.USER.NEW, {userName: "ahihi"});
        throw new errors.NotImplemented();
    }

    login(req, res, next){
        UserService.getAccessToken(req.user)
        .then(result => {
            res.status(HTTPStatus.OK).json(result);
        }, next);
    }
}
export default new AuthController();
