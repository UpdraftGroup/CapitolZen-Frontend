import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import { computed } from '@ember/object';
import ENV from 'capitolzen-client/config/environment';

export default Route.extend(ApplicationRouteMixin, {
  session: service(),
  currentUser: service(),
  flashMessages: service(),

  /**
   *
   */
  routeAfterAuthentication: computed(function() {
    if (this.get('currentUser.organizations.length')) {
      return 'dashboard';
    }
  }),

  /**
   * After the user has been authenticated
   */
  sessionAuthenticated() {
    this.get('currentUser')
      .sessionAuthenticated()
      .then(() => {
        if (this.get('currentUser.user')) {
          if (this.get('session.data.currentPageId')) {
            this.transitionTo('page', this.get('session.data.currentPageId'));
          } else {
            this.transitionTo(this.get('routeAfterAuthentication'));
          }
        }
      });
  },

  actions: {
    /**
     * @param error
     * @param transition
     */
    error(error) {
      if (error.errors) {
        if (ENV.environment === 'production') {
          if (parseInt(error.errors[0].status) === 404) {
            this.transitionTo('not-found');
          } else {
            this.transitionTo('error-route');
          }
        }
      }
    }
  }
});
