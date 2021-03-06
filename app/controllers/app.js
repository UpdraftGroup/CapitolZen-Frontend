/* global document */
import Controller from '@ember/controller';
import { set } from '@ember/object';

export default Controller.extend({
  menuState: false,
  locked: false,
  actions: {
    toggleMenuState() {
      set(this, 'menuState', true);
    }
  }
});
