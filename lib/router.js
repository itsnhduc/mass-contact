import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/', {
  name: 'index',
  action: function () {
    BlazeLayout.render('master', { content: 'index' });
  }
});
FlowRouter.route('/game', {
  name: 'game',
  action: function () {
    BlazeLayout.render('master', { content: 'game' });
  }
});
FlowRouter.route('/leaderboard', {
  name: 'leaderboard',
  action: function () {
    BlazeLayout.render('master', { content: 'leaderboard' });
  }
});