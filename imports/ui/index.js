import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';
import { $ } from 'meteor/jquery';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './index.html';

Template.index.helpers({

});

Template.index.events({
  'click #login'(event) {
    event.preventDefault();
    const username = $('#login-username').val();
    const password = $('#login-password').val();
    Meteor.loginWithPassword(username, password, (err) => {
      if (err && err.message) {
        alert(err.message);
      }
    });
  },
  'click #register'(event) {
    event.preventDefault();
    const username = $('#reg-username').val();
    const password = $('#reg-password').val();
    const confPassword = $('#reg-conf-password').val();
    if (password === confPassword) {
			let profile = {
				scoreContactor: 0,
				scoreHolder: 0
			}
      Accounts.createUser({ username, password, profile }, (err) => err && err.message && alert(err.message));
    } else {
      alert('Passwords do not match!');
    }
  },
  'click #logout'(event) {
    event.preventDefault();
    Meteor.logout((err) => err && err.message && alert(err.message));
  },
  'click #play'() {
    event.preventDefault();
    FlowRouter.go('/game');
  }
});
