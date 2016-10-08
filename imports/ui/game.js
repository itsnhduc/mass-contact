import { Template } from 'meteor/templating';
import { Words } from '../collections/words';

import './game.html';
import './word.html';

Template.game.helpers({
  words() {
    return Words.find().fetch();
  }
});

Template.game.events({
  'click #submit-word'() {
    const newWord = $('#new-word').val();
    Meteor.call('createWord', Meteor.userId(), newWord);
    $('#new-word').val('');
  }
});