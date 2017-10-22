import Component from '@ember/component';
import { get, computed } from '@ember/object';

export default Component.extend({
  sortedHistory: computed.sort('bill.history', function(a, b) {
    if (get(a, 'date') === get(b, 'date')) {
      return 0;
    } else if (get(a, 'date') < get(b, 'date')) {
      return 1;
    } else {
      return -1;
    }
  })
});
