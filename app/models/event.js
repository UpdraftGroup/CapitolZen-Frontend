import DS from 'ember-data';
import { computed, get } from '@ember/object';
import moment from 'moment';
import { htmlSafe } from '@ember/string';
import { alias } from '@ember/object/computed';

export default DS.Model.extend({
  chamber: DS.attr('string'),
  state: DS.attr('string'),
  time: DS.attr('string'),
  eventType: DS.attr('string'),
  locationText: DS.attr('string'),
  description: DS.attr('string'),
  committee: DS.belongsTo('committee'),
  url: DS.attr('string'),
  attachments: DS.attr(),
  created: DS.attr('string'),
  metadata: DS.attr(),
  location: alias('locationText'),
  billList: computed('attachments', function() {
    return get(this, 'attachments')[0].billlist;
  }),
  name: computed('eventType', function() {
    let map = {
      'committee:meeting': 'Committee - Meeting'
    };

    return map[get(this, 'eventType')];
  }),
  start: computed('time', function() {
    return moment(get(this, 'time'), 'YYYY-MM-DDTHH:mm:ssZZ');
  }),
  end: computed('time', function() {
    let start = moment(get(this, 'time'), 'YYYY-MM-DDTHH:mm:ssZZ');
    return start.add(90, 'minutes');
  }),
  descriptionHtml: computed('description', function() {
    return htmlSafe(get(this, 'description'));
  }),
  title: alias('committee.displayName'),
  loadCommittee() {
    return get(this, 'committee');
  }
});
