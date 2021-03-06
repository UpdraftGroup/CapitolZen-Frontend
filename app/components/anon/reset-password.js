import userResetPassword from '../../validators/user-reset-password';
import FormComponent from 'ember-junkdrawer/components/form/changeset-form';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { get, computed } from '@ember/object';

export default FormComponent.extend({
  ajax: service(),
  flashMessages: service(),
  session: service(),
  router: service(),

  validator: userResetPassword,
  model: computed(function() {
    return {
      password: '',
      confirmPassword: ''
    };
  }),

  /**
   * Success
   */
  onSubmitSuccess(data) {
    let authenticator = 'authenticator:jwt';
    let creds = {
      identification: data.data.email,
      password: this.get('model.password')
    };

    get(this, 'session')
      .authenticate(authenticator, creds)
      .then(() => {
        this.get('router').transitionTo('dashboard');
      });
  },

  /**
   * Replace the submit handler since we're not just running changeset.save
   */
  submit: task(function*(changeset) {
    changeset.execute();
    this.set('model.token', this.get('token'));
    let payload = this.get('model');

    yield this.get('ajax')
      .post('users/reset_password/', { data: payload })
      .then(data => {
        this.onSubmitSuccess(data);
      })
      .catch(data => {
        this.handleServerFormErrors(data);
        this.setFormState('default');
        this.onServerError(data);
      });
  }).drop()
});
