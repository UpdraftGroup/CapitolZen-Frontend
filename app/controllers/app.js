import Ember from 'ember';

const {
  inject: {
    service
  }
} = Ember;

export default Ember.Controller.extend({
  session: service('session'),
  currentUser: service("current-user"),
  actions: {
    invalidateSession(){
      this.get('session').invalidate();
    }
  }
});