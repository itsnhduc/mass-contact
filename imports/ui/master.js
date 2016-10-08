import { Template } from 'meteor/templating';

import './master.html';

Template.master.helpers({
  routes() {
    return [
      { path: '/', label: 'Index' },
      { path: '/game', label: 'Game' },
      { path: '/leaderboard', label: 'Leaderboard' }
    ].map(entry => {
      const tempEntry = entry;
      tempEntry.isActive = FlowRouter.current().path === tempEntry.path ? 'active' : '';
      return tempEntry;
    });
  }
});

Template.master.events({
  'click .route'() {
    $('.route').removeClass('active');
    $(event.target).parent('.route').addClass('active');
  }
});