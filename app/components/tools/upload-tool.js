import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { get } from '@ember/object';
import { task } from 'ember-concurrency';

export default Component.extend({
  flashMessages: service(),
  store: service(),
  fetch: service(),
  currentUser: service(),
  group: null,
  multiple: true,
  name: 'fileUpload',
  accept: '*/*',
  acl: 'public-read',
  upload: task(function*(file) {
    let org =
      get(this, 'group.organization') || get(this, 'currentUser.organization');
    let group = get(this, 'group') || false;
    let uploadParams = {
      group: group,
      name: get(file, 'name'),
      organization: org,
      acl: get(this, 'acl')
    };

    let { data: { params: { url, fields } } } = yield get(
      this,
      'fetch'
    ).getAssetUploadUrl(uploadParams);
    fields['acl'] = get(this, 'acl');
    fields['success_action_status'] = '201';
    let response = yield file.upload({
      url: url,
      contentType: false,
      data: fields
    });
    get(this, 'resultAction')(response);
  }).enqueue(),
  actions: {
    fileUpload(file) {
      get(this, 'upload').perform(file);
    }
  }
});
