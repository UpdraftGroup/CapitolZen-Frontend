import Component from '@ember/component';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import { task } from 'ember-concurrency';
import { computed, get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias, equal } from '@ember/object/computed';

export default Component.extend(RecognizerMixin, {
  store: service(),
  flashMessages: service(),
  classNames: ['card', 'w100'],
  referencedModelType: alias('model.referencedModelName'),
  referencedModelId: alias('model.modelId'),
  referencedModelLinkTo: computed('referencedModelType', function() {
    return get(this, 'referencedModelType').toLowerCase();
  }),

  isBill: equal('referencedModelType', 'Bill'),
  isCommittee: equal('referencedModelType', 'Committee'),
  isWrapper: equal('referencedModelType', 'Wrapper'),

  loadReferencedModel: task(function*() {
    let record = yield get(this, 'store').findRecord(
      get(this, 'referencedModelType'),
      get(this, 'referencedModelId')
    );
    set(this, 'referencedModel', record);
  }).on('didReceiveAttrs'),

  title: alias('model.displayTitle'),

  _dismissAction() {
    get(this, 'model')
      .updateState('dismissed')
      .catch(err => {
        console.error(err);
        get(this, 'flashMessages').danger(
          'An error occurred, and our team has been notified!'
        );
      });
  },
  swipe() {},
  actions: {
    dismiss() {
      this._dismissAction();
    }
  }
});
