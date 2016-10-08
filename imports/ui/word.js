import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import './word.html';

Template.word.helpers({
  holderName() {
    const curWord = this;
    if (Meteor.userId() === curWord.holderId) {
      return 'me';
    } else {
      return Meteor.users.findOne(curWord.holderId).username;
    }
  },
  revealedWord() {
    const curWord = this;
    if (Meteor.userId() === curWord.holderId) {
      return curWord.word;
    } else {
      return curWord.word.slice(0, curWord.revealedCount);
    }
  },
	guessOutput(){
		const curWord = this;
		if (curWord.winnerId) {
			if (curWord.winnerId === Meteor.userId()) {
				return "You Win!";
			}
			else {
				return Meteor.users.findOne({_id: curWord.winnerId}).username + " Win!";
			}
		}
		else if (curWord.revealedCount === curWord.word.length) {
			//FIXME: the last one who contact win the game
			return "Draw";
		}

		return "";
	},
  isHinter() {
    const curHint = this;
    return Meteor.userId() === curHint.hinterId;
  },
  isHolder() {
    const curWord = Template.instance().data;
    return Meteor.userId() === curWord.holderId;
  },
	isWon() {
		const curWord = Template.instance().data;
		if (curWord.winnerId || curWord.revealedCount == curWord.word.length) {
			return "disabled";
		}
		else {

			return "";
		}
	},
  guessesLeft() {
    const curHint = this;
    console.log(this);
    return 5 - curHint.guessCount;
  }
});

Template.word.events({
	'click .submit-hint'(event) {

		const curWord = this;
		const newHint = $(event.target).parent().find('.new-hint').val();
		const newHintWord = $(event.target).parent().find('.new-hint-word').val();
		console.log(newHint);
		console.log(newHintWord);
		Meteor.call('addHint', Meteor.userId(), curWord, newHint, newHintWord);
		$('.new-hint, .new-hint-word').val('');
	},
  'click .remove-hint'() {
		const curWordId = Template.instance().data._id;
    Meteor.call('removeHint', Meteor.userId(), curWordId);
  },
  'click .submit-guess'() {
    // do stuff
  },
  'click .submit-contact'() {
    // do stuff
  },
  'click .submit-holder-word'(event) {
    // do stuff phi do it
		const curWord = this;
		let curTag = $(event.target).parent();
		console.log(this);
		let guessed = $(curTag).find('.holder-word').val();

		if (guessed) {
			console.log("guessword: " + guessed);
			Meteor.call('guessHolderWord', curWord, Meteor.userId(), guessed);
		}

		// showing wrong notice
		let wrongTag = $(curTag).find('.wrong-guess');

		if (!(guessed.toUpperCase() === curWord.word.toUpperCase())) {
			$(wrongTag).html("<i>Wrong Guess!</i>");
			$(wrongTag).fadeOut(1000, function (){
				$(this).html("").show();
			});
		}

		$('.holder-word').val('');
  },
	'click .hide-word'(event) {
		let article = $(event.target).parent().parent();
		console.log($(article));
		$(article).fadeOut(600);
	}
});
