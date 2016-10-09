import { Template } from 'meteor/templating';
<<<<<<< HEAD
import { Words } from '../collections/words';

=======
>>>>>>> 7a8ae72... update score function
import './leaderboard.html';

Template.leaderboard.onCreated(function onCreated(){


});

Template.leaderboard.helpers({
<<<<<<< HEAD
	records() {
		//console.log(Meteor.users.find().fetch());
		this.bestContacter = Meteor.users.find({}, {sort: {'profile.scoreContactor': -1}}).fetch();
		this.bestHolder = Meteor.users.find({}, {sort: {'profile.scoreHolder': -1}}).fetch();
		this.bestBoth = Meteor.users.find({}, {sort: {'profile.scoreBoth': -1}}).fetch();
		this.ranking = [];
		console.log(Meteor.users.find().count());
		for (var i = 0; i < Meteor.users.find().count(); i++) {

			this.ranking.push({contactor: this.bestContacter[i], holder: this.bestHolder[i], best: this.bestBoth[i]});
		}
		return this.ranking;
	}
=======
>>>>>>> 7a8ae72... update score function
});

Template.leaderboard.events({

});

Template.record.helpers({
	nameHolder() {
		const ranking = Template.instance().data;
		return ranking.holder.username;
	},
	scoreHolder() {
		const ranking = Template.instance().data;
		return ranking.holder.profile.scoreHolder;
	},
	nameContactor() {
		const ranking = Template.instance().data;
		return ranking.contactor.username;
	},
	scoreContactor() {
		const ranking = Template.instance().data;
		return ranking.contactor.profile.scoreContactor;
	},
	nameBest() {
		const ranking = Template.instance().data;
		return ranking.best.username;
	},
	scoreBest()  {
		const ranking = Template.instance().data;
		return ranking.best.profile.scoreBoth;
	}
});
