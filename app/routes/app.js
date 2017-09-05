import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  session: service('session'),
  currentUser: service('current-user'),
  beforeModel() {
    return this.get('currentUser').load();
  }
});
