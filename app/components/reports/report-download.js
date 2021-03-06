import { assert } from '@ember/debug';
import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  flashMessages: service(),
  currentUser: service(),
  request: service(),
  tagName: 'button',
  size: false,
  report: null,
  type: 'primary',
  classNames: ['btn'],
  classNameBindings: ['size', 'classType'],
  classType: computed('type', function() {
    return `btn-${get(this, 'type')}`;
  }),
  download: task(function*() {
    assert('Must provide a report model', get(this, 'report'));
    let reportId = get(this, 'report.id');
    let { data: { url } } = yield get(this, 'request').request(
      `reports/${reportId}/url/`
    );
    let link = document.createElement('a');
    link.setAttribute('href', url);
    get(this, 'currentUser').event('report:download');
    link.click();
  }),
  click() {
    get(this, 'download').perform();
  }
});
