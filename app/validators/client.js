import {
  validatePresence,
  validateFormat,
  validateLength
} from 'ember-changeset-validations/validators';

export default {
  title: [validatePresence({ presence: true }), validateLength({ max: 40 })],
  avatar: [validateFormat({ allowBlank: true })],
  description: [validateLength({ max: 500, allowBlank: true })]
};
