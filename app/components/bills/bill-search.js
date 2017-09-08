import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { set, get } from '@ember/object';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  billSearch: service(),
  results: alias('billSearch.results'),
  currentQuery: alias('billSearch.query'),
  searchTerms: alias('billSearch.queries'),
  searching: alias('billSearch.searchBills.isRunning'),
  actions: {
    search() {
      let term = get(this, 'currentQuery');
      get(this, 'billSearch').search(term);
    },
    searchFromPrevious(term) {
      set(this, 'currentQuery', term);
      get(this, 'billSearch').search(term);
    }
  }
});
