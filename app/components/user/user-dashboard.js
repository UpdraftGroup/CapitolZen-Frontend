import Component from '@ember/component';
import { set, get, computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
export default Component.extend({
  currentUser: service(),
  store: service(),
  userName: computed.alias('currentUser.user.name'),
  orgName: computed.alias('currentUser.organization.name'),
  userSavedGroups: computed.alias('currentUser.user.savedGroups'),
  queriedGroup: [],
  groupList: computed(function() {
    if (isEmpty(get(this, 'userSavedGroups'))) {
      return get(this, 'queriedGroup');
    } else {
      return get(this, 'userSavedGroups');
    }
  }),
  fetchGroups: task(function*() {
    let groups = yield get(this, 'store').findAll('group');
    set(this, 'queriedGroup', groups);
  }).on('init'),
  fetchBills: task(function*() {
    let bills = yield get(this, 'store').query('bill', {
      limit: '10',
      ordering: 'last_action_date'
    });
    set(this, 'recentBills', bills);
  }).on('init'),
  actions: {
    dismissIntro() {
      get(this, 'currentUser.user').dismissWelcome();
    }
  }
});
