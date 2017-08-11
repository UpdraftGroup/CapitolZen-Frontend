import Ember from "ember";

const { get, set, Component, computed, inject: { service } } = Ember;

export default Component.extend({
  store: service(),
  flashMessages: service(),
  inviteModal: false,
  inviteEmail: null,
  inviteSortDesc: ["name:desc"],
  sortedInvites: computed.sort("invites", "inviteSortDesc"),
  actions: {
    inviteUser() {
      let invite = get(this, "store").createRecord("invite", {
        email: get(this, "inviteEmail"),
        organization: get(this, "org")
      });
      invite
        .save()
        .then(() => {
          get(this, "flashMessages").success(
            `${get(this, "inviteEmail")} invited!`
          );
        })
        .catch(() => {
          get(this, "flashMessages").danger(
            "An error occurred. Please try again."
          );
        })
        .finally(() => {
          set(this, "inviteEmail", null);
          set(this, "inviteModal", false);
        });
    }
  }
});
