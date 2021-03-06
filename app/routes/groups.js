import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { set } from '@ember/object';

export default Route.extend(AuthenticatedRouteMixin, {
  breadCrumb: {
    title: 'Clients'
  },
  beforeModel() {
    let label = this.features.clientLabelPlural;
    set(this, 'breadCrumb', { title: label });
  }
});
