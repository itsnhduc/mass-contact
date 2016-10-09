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
    return curWord.word.slice(0, curWord.revealedCount);

  },
	restWord() {
		const curWord = this;
		const rest = curWord.word.slice(curWord.revealedCount, curWord.word.length);
		return rest;
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

	isHidden() {
		const curWord = Template.instance().data;
		//console.log(localStorage.getItem('omitWords'));
		if (JSON.parse(localStorage.getItem('omitWords'))) {
			let omitWords = JSON.parse(localStorage.getItem('omitWords'));
			console.log(omitWords);
			if (omitWords.indexOf(curWord._id) > -1) {
				console.log("Hide" + curWord._id);
				return "hidden";
			}
			else {
				return "";
			}
		}
		else {
			return "";
		}
	},
  guessesLeft() {
    const curHint = this;
    return 5 - curHint.guessCount;
  },
  isHintLocked() {
    const currHint = this;
    return (!(currHint.contactorId == null));
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
    const curWord = Template.instance().data;
		//const curWordId = curWord._id;
    Meteor.call('removeHint', Meteor.userId(), curWord, true);
  },
  'click .submit-guess[type=submit]'() {
    const curWord = Template.instance().data;
    console.log(this);
    const curHint = this;
    const guessWord = $(".submit-guess").val();
    if (curHint.guessCount < 5 ) {
      if (guessWord.toUpperCase() === curHint.word.toUpperCase()) {
        Meteor.call('removeHint', curHint.hinterId, curWord, false);
        Meteor.call('updateScore', Meteor.user()._id, false);
      } else {
          Meteor.call('increaseGuessCount', curHint.hinterId, curWord._id);
          if (curHint.guessCount  == 4 )
          	Meteor.call('revealHint', curHint.hinterId, curWord._id);
        }
    }
  },
  'click .submit-contact'(event) {
    const curWord = Template.instance().data;
    const curWordId = curWord._id;
    const header = curWord.word.slice(0, curWord.revealedCount);
    const hintGuessWord = event.target.closest('li').getElementsByClassName('guess-hint-word')[0].value;
    if(header.toUpperCase() == hintGuessWord.slice(0, curWord.revealedCount).toUpperCase()){
      Meteor.call('contact', this.hinterId, Meteor.userId(), hintGuessWord, curWordId);
    } else {
      alert("Please input correct word start with revealed letters");
    }

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
		const curWord = this;
		console.log($(article));
		$(article).fadeOut(600);

		let omitWords = [curWord._id, ""];
		//localStorage.removeItem("omitWords");
		if (JSON.parse(localStorage.getItem('omitWords'))) {
			omitWords = JSON.parse(localStorage.getItem('omitWords'));
			omitWords.push(curWord._id);
			localStorage.setItem('omitWords', JSON.stringify(omitWords));
		}
		else {
			localStorage.setItem('omitWords', JSON.stringify(omitWords));
		}
	}
});
