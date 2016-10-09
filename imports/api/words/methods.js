import { Meteor } from 'meteor/meteor';
import { Words } from '../../collections/words';
import { Dictionary} from '../../collections/dictionary';

Meteor.methods({
  'createWord'(holderId, newWord) {
    const word = newWord.toUpperCase();
    Words.insert({
      holderId,
      word,
      revealedCount: 1,
      hintCount: 0,
      usedWords: [],
      winnerId: null,
      hints: []
    });
  },
  'addHint'(hinterId, curWord, hint, hintWord) { // chua check usedWord
    const isNotOverHintLimit = curWord.hints.length < 5;
    const isNotCurrentlyHinting = curWord.hints.filter(h => h.hinterId === hinterId).length === 0;
    if (isNotOverHintLimit && isNotCurrentlyHinting) {
      const word = hintWord.toUpperCase();
			console.log("addHint:" + word);
      Words.update(curWord._id, { $addToSet: {
          hints: {
            hinterId, // Mongo ID, userId
            contactorId: null, // Mongo ID, userId
            word,
            wordGuess: null,
            hint,
            guessCount: 0
          }
      }});
    } else {
      if (isNotOverHintLimit) {
        console.log('cannot create more hints');
      }
      if (isNotCurrentlyHinting) {
        console.log('user already has an active hint');
      }
    }
  },

  'increaseGuessCount'(hinterId, curWordId) {
    const word = Words.findOne({'_id': curWordId});
    const newHints = Words.findOne({'hints.hinterId': hinterId}).hints;
    //console.log(newHints);
    for (i=0; i<newHints.length; i++) {
      if (newHints[i].hinterId == hinterId) {
        newHints[i].guessCount++;
        break;
      }
    }
    console.log(newHints);
    Words.update(curWordId, {$set: {hints: newHints}});
  },

  'removeHint'(hinterId, curWord, success) {
    //const word = Words.findOne({'_id': curWordId});
    for(i = 0; i < curWord.hints.length; i++){
      if (curWord.hints[i].hinterId == hinterId){
        hint = curWord.hints[i];
        break;
      }
    }
    Meteor.call('addUsedWord', hint.word, curWord._id); 
    if (hint.wordGuess !== null) {
      Meteor.call('addUsedWord', hint.wordGuess, curWord._id); 
    }

    Words.update(curWord._id, { $pull: {
      hints: { hinterId }
    }});

    if (!success) {
      Words.update(curWord._id, {$set: {hintCount: curWord.hintCount+1}});
    }
    
  },

  'revealHint' (hinterId, curWordId) {
    console.log(curWordId);
    const word = Words.findOne({'_id': curWordId});
    console.log(word);
    var hint;
    for(i = 0; i < word.hints.length; i++){
      if (word.hints[i].hinterId == hinterId){
        hint = word.hints[i];
        break;
      }
    }

    // const hinter = Meteor.users.findOne({'_id': hint.hinterId});
    // const contactor = Meteor.users.findOne({'_id': hint.contactorId})
    if (hint.wordGuess !== null) {
      if(hint.wordGuess.toUpperCase() == hint.word.toUpperCase()){
          Meteor.call('updateScore', hinterId, true);
          Meteor.call('updateScore', hint.contactorId, true);
          Words.update(curWordId, {$set : {revealedCount: word.revealedCount + 1}});
          Meteor.call('removeHint', hinterId, word, true);
      }else{
        //contact failed, and remove hint
          Meteor.call('removeHint', hinterId, word, false);
      }
    } else {
      //chua xu li truong hop nay
      //console.log("lam gi day");
    }


  },

  'updateScore'(userId, isContactor){
    const user = Meteor.users.findOne({'_id': userId});
    if (isContactor) {
      Meteor.users.update(userId, {$set : {
        'profile.scoreContactor': user.profile.scoreContactor+1
      }});
    } else {
        Meteor.users.update(userId, {$set : {
        'profile.scoreHolder': user.profile.scoreHolder+1
      }});
    }

    Meteor.users.update(userId, {$set : {
<<<<<<< HEAD
        'profile.scoreBoth': user.profile.scoreHolder + user.profile.scoreContactor
=======
        'profile.scoreBoth': user.profile.scoreBoth+1
>>>>>>> 7a8ae72... update score function
      }});
  },

	'guessHolderWord'(curWord, hinterId, guessWord) {

		const word = curWord.word.toUpperCase();
		if (word === guessWord.toUpperCase()) {
			// update score
			Meteor.users.update(Meteor.userId(), {$set: {
				'profile.scoreContactor': Meteor.user().profile.scoreContactor + 1
			}});

			console.log("user: " + Meteor.user());
			Words.update(curWord._id, {$set: {
				winnerId: Meteor.userId()
			}});
			console.log("word: " + word);

		}
	},

  'addUsedWord'(usedWord, curWordId){
    Words.update(curWordId, { $addToSet: {
          usedWords: usedWord.toUpperCase()
      }});
  },
  'contact'(hinterId, contactorId, hintGuessWord, curWordId) {
    const word = Words.findOne({'_id': curWordId});
    var hint;
    for(i = 0; i < word.hints.length; i++){
      if (word.hints[i].hinterId == hinterId){
        hint = word.hints[i];
        break;
      }
    }
    console.log(hint);
    console.log(hint.contactorId != null);
    if(hint.contactorId == null){
      Words.update({_id: curWordId,
                  "hints.hinterId" : hinterId
                },
                {
                  $set :{'hints.$.wordGuess' : hintGuessWord.toUpperCase(),
                         'hints.$.contactorId': contactorId}
                });
      if(hint.guessCount == 5){
        Meteor.call('revealHint', hinterId, curWordId);
      }else{
        Words.update({_id: curWordId,
                  "hints.hinterId" : hinterId
                },
                {
                  $set :{'hints.$.guessCount': 4}
                });
      }
    }

  }
});
