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
    console.log("vo roi")
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
    console.log("1");
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

    console.log("2");
    if (!success) {
      Words.update(curWord._id, {$set: {hintCount: curWord.hintCount+1}});
    }
    console.log("3");

    
  },

  'revealHint' (hinterId, curWordId) {
    const word = Words.findOne({'_id': curWordId});
    var hint;
    for(i = 0; i < word.hints.length; i++){
      if (word.hints[i].hinterId == hinterId){
        hint = word.hints[i];
        break;
      }
    }

    if (hint.wordGuess !== null) {
      if(hint.wordGuess.toUpperCase() == hint.word.toUpperCase()){
          //contact successfully, then reveal one more letter
          Words.update(curWordId, {$set : {revealedCount: word.revealedCount + 1}});
          Meteor.call('removeHint', hinterId, curWordId, true);
      }else{
        //contact failed, and remove hint
          Meteor.call('removeHint', hinterId, curWordId, false);
      }
    } else {
      //chua xu li truong hop nay
      console.log("lam gi day");
    }


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
                  $set :{'hints.$.guessCount': 4,
                         'hints.$.wordGuess' : hintGuessWord.toUpperCase(),
                         'hints.$.contactorId': contactorId}
                });
    }

  }
});
