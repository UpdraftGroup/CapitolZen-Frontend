import Component from '@ember/component';
import { get, set } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Component.extend({
  didReceiveAttrs() {
    if (get(this, 'row.bill')) {
      set(this, 'bill', get(this, 'row.bill'));
    } else {
      set(this, 'bill', get(this, 'row'));
    }
  },
  date: alias('bill.lastActionDate'),
  status: alias('bill.computedStatus')
});
