import Component from '@ember/component';
import layout from '../../templates/components/koenig-card/html';
import { isBlank } from '@ember/utils';
import { run } from '@ember/runloop';
import { set } from '@ember/object';

export default Component.extend({
  layout,

  // attrs
  payload: null,
  isSelected: false,
  isEditing: false,

  // closure actions
  saveCard() {},
  deleteCard() {},

  init() {
    this._super(...arguments);

    if (!this.get('payload.html')) {
      this.set('payload.html', '');
    }
  },

  actions: {
    updateHtml(html) {
      this._updatePayloadAttr('html', html);
    },

    updateCaption(caption) {
      this._updatePayloadAttr('caption', caption);
    },

    leaveEditMode() {
      if (isBlank(this.get('payload.html'))) {
        // afterRender is required to avoid double modification of `isSelected`
        // TODO: see if there's a way to avoid afterRender
        run.scheduleOnce('afterRender', this, function() {
          this.deleteCard();
        });
      }
    }
  },

  _updatePayloadAttr(attr, value) {
    let payload = this.get('payload');
    let save = this.get('saveCard');

    set(payload, attr, value);

    // update the mobiledoc and stay in edit mode
    save(payload, false);
  }
});
