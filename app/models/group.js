import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  description: DS.attr('string'),
  attachments: DS.attr(),
  organization: DS.belongsTo('organization', { async: false }),
  avatar: DS.attr('string'),
  created: DS.attr('date'),
  modified: DS.attr('date'),
  starred: DS.attr('boolean'),
  active: DS.attr('boolean'),
  assigned_to: DS.hasMany('user')
});
