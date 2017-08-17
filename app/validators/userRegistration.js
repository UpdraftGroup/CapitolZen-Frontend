import {
  validatePresence,
  validateFormat,
  validateLength,
  validateConfirmation
} from 'ember-changeset-validations/validators';

export default {
  name: [validatePresence(true)],
  username: validateFormat({ type: 'email' }),

  password: [validateLength({ min: 8 })],
  confirmPassword: validateConfirmation({ on: 'password' })
};
