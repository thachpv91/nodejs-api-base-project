/* eslint-disable no-unused-vars */
/**
 * User controller
 */

import Joi from 'joi';
import HTTPStatus from 'http-status';
import errors from '../utils/errors';
import UserService from '../services/user.service';

export const validation = {
  create: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .regex(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)
        .required(),
      username: Joi.string()
        .min(3)
        .max(20)
        .required(),
    },
  },
};

class UserController {
    create(req, res, next){
        throw new errors.NotImplemented();
    }

    getUserInfo(req, res, next){
        throw new errors.NotImplemented();
    }

    getUserWallets(req, res, next){
        throw new errors.NotImplemented();
    }
}
export default new UserController();
