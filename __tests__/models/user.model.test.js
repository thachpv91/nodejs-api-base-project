/* eslint-disable no-unused-vars */
import { expect } from 'chai';

import User from '../../src/models/user.model';

let testUser;
let defaultUser;

const masterUser = {
  email: 'test@gmail.com',
  username: 'test!',
};

describe('Model: User', () => {
  before(async () => {
    await User.remove();
    testUser = await User.create(masterUser);
  });

  beforeEach(() => {
    defaultUser = {
      ...masterUser,
    };
  });

  describe('#save()', () => {
    it('should required email', () => {
      const user = new User();
      const { errors } = user.validateSync();
      expect(errors.email.message).to.equal('Email is required!');
    });

    it('should required a valid email', () => {
      defaultUser.email = 'notgoodemail';
      const user = new User(defaultUser);
      let validation = user.validateSync();
      expect(validation.errors.email.message).to.equal(
        `${defaultUser.email} is not a valid email!`,
      );
      user.email = 'test@gmail.com';
      validation = user.validateSync();
      expect(validation).to.equal(undefined);
    });
  });
});
