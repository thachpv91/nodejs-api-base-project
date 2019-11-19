/* eslint-disable no-unused-vars */
/**
 * Authentication controller
 */
import Joi from 'joi';
import errors from '../utils/errors';
import { appEvent , EVENTS } from '../event';
import appErrors from '../app-errors';

export const validation = {
  example2: {
    body: {
      text: Joi.string()
        .required(),
    },
  },
};

class ExampleController {
    example(req, res, next){
        appEvent.emit(EVENTS.EXAMPLE, "TEST1");
        throw new errors.NotImplemented("Custome message");
    }

    example2(req, res, next){
        throw new errors.BadRequest(appErrors.INCORRECT_FORMAT);
    }

}
export default new ExampleController();
