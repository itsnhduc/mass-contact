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
  isHinter() {
    const curHint = this;
    return Meteor.userId() === curHint.hinterId;
  },
  isHolder() {
    const curWord = Template.instance().data;
    return Meteor.userId() === curWord.holderId;
  },
  guessesLeft() {
    const curHint = this;
    console.log(this);
    return 5 - curHint.guessCount;
  },
  isHintLocked() {
    const currHint = this;
    return (!(currHint.contactorId == null));
  }
});

Template.word.events({
  'click .submit-hint'() {
    const curWord = this;
    const newHint = $('.new-hint').val();
    const newHintWord = $('.new-hint-word').val();
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
  'click .submit-contact'(event) {
    const curWord = Template.instance().data;
    const curWordId = curWord._id;
    const header = curWord.word.slice(0, curWord.revealedCount);
    const hintGuessWord = event.target.closest('li').getElementsByClassName('guess-hint-word')[0].value;
    if(header.toUpperCase() == hintGuessWord.slice(0, curWord.revealedCount).toUpperCase()){
      Meteor.call('contact', this.hinterId, Meteor.userId(), hintGuessWord, curWordId);
    }else{
      alert("Please input correct word start with revealed letters");
    }
    
  },
  'click .submit-holder-word'() {
    // do stuff
  }
});