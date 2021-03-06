import Component from '@ember/component';
import { get, getWithDefault, computed, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { A } from '@ember/array';

export default Component.extend({
  store: service(),
  media: service(),
  currentUser: service(),
  windoc: service(),
  router: service(),
  facetsCollapsed: false,
  twoCol: true,
  group: false,
  model: A(),
  activeDay: null,
  filters: {
    search: '',
    group: null,
    sort_by: 'created',
    title: null,
    state: 'active'
  },
  sorts: 'created',
  sortsDirection: '-',
  type: false,
  titleOptions: A(['bill:introduced', 'wrapper:updated']),

  /**
   *
   */
  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'setupFacets').perform();
  },

  /**
   *
   */
  setupFacets: task(function*() {
    let groups = yield get(this, 'store').query('group', {
      active: true,
      assigned_to: get(this, 'currentUser.user_id'),
      sort: 'title'
    });

    if (get(this, 'group')) {
      let selected = groups.findBy('id', get(this, 'group'));
      set(this, 'filters.group', selected);
    } else {
      set(this, 'filters.group', { id: null, title: 'None' });
    }

    if (get(this, 'media.isMobile')) {
      set(this, 'facetsCollapsed', true);
    }

    if (
      get(this, 'type') &&
      get(this, 'titleOptions').includes(get(this, 'type'))
    ) {
      set(this, 'filters.title', get(this, 'type'));
    }

    let list = groups.toArray();
    list.unshift({ id: null, title: 'None' });

    set(this, 'availableGroups', list);
    this._updateRecords();
  }),

  _updateRecords() {
    get(this, 'fetchRecords').perform();
  },

  // Prevent pagination fails
  cachedParams: null,

  /**
   *
   */
  fetchRecords: task(function*() {
    let params = { pageSize: 30 };

    params.sort = `${get(this, 'sortsDirection')}${get(this, 'sorts')}`;
    let currentPage = get(this, 'currentPage');
    let filters = get(this, 'filters');

    if (filters.group && filters.group.id) {
      set(filters, 'group', filters.group.id);
    } else {
      set(filters, 'group', null);
    }

    params = Object.assign(filters, params);

    let precache = params;
    delete precache.page;
    let currentParams = JSON.stringify(precache);

    let paramsMatch = currentParams === get(this, 'cachedParams');
    set(this, 'cachedParams', currentParams);

    if (currentPage && paramsMatch) {
      params['page'] = currentPage;
    }

    if (!paramsMatch) {
      set(this, 'model', A());
    }

    try {
      let records = yield get(this, 'store').query('action', params);
      get(this, 'model').addObjects(records);

      let meta = records.get('meta');
      let { pages, page, count } = meta.pagination;
      page++;
      set(this, 'totalPages', pages);
      set(this, 'currentPage', page);
      set(this, 'totalRecordCount', count);
    } catch (e) {
      console.log(e); // eslint-disable-line
    }
  }).drop(),

  /**
   *
   */
  recordsComplete: computed(
    'windoc.{scrollTop,scrollHeight}',
    'totalRecordCount',
    'model.[]',
    function() {
      let top = get(this, 'windoc.scrollTop'),
        total = get(this, 'windoc.scrollHeight'),
        modelLength = get(this, 'model.length'),
        totalServerCount = get(this, 'totalRecordCount');

      let height = top / total > 0.55;

      if (height && modelLength < totalServerCount) {
        get(this, 'fetchRecords').perform();
      }

      if (top === 0 && modelLength < 10 && modelLength < totalServerCount) {
        get(this, 'fetchRecords').perform();
      }
      return modelLength <= totalServerCount;
    }
  ),

  /**
   *
   */
  actions: {
    loadMore() {
      get(this, 'fetchRecords').perform();
    },

    filter(filters) {
      this._updateRecords();
      let title = getWithDefault(filters, 'title', false);
      get(this, 'router').transitionTo({ queryParams: { type: title } });
    },
    toggleMobileFacets() {
      this.toggleProperty('facetsCollapsed');
    },
    dismissAction(action) {
      action.updateState('dismissed');
      action.save().then(() => {
        get(this, 'currentUser').event('action:dismiss');
        get(this, 'model').removeObject(action);
      });
    },
    updateActiveDate(action) {
      if (get(this, 'activeDay') !== action.get('day')) {
        set(this, 'activeDay', action.get('day'));
      }
    }
  }
});
