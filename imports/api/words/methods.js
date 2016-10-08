import { Meteor } from 'meteor/meteor';
import { Words } from '../../collections/words';

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
  'addHint'(hinterId, curWord, hint, hintWord) {
    const isNotOverHintLimit = curWord.hints.length < 5;
    const isNotCurrentlyHinting = curWord.hints.filter(h => h.hinterId === hinterId).length === 0;
    if (isNotOverHintLimit && isNotCurrentlyHinting) {
      const word = hintWord.toUpperCase();
      Words.update(curWord._id, { $addToSet: {
          hints: {
            hinterId, // Mongo ID, userId
            contactorId: null, // Mongo ID, userId
            word,
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
  'removeHint'(hinterId, curWordId) {
    Words.update(curWordId, { $pull: {
      hints: { hinterId }
    }});
  },
  'addUsedWord'(usedWord, curWordId){
    Words.update(curWordId, { $addToSet: {
          usedWords: usedWord.toUpperCase()
      }});
  },
  'contact'(hinterId, hintGuessWord, curWordId) {
    Words.update({_id: curWordId,
                  "hints.hinterId" : hinterId
                },
                {
                  $set :{'hints.$.guessCount': 4}
                });
    Meteor.setTimeout(function(){
      const word = Words.findOne({'_id': curWordId});
      var hint;
      for(i = 0; i < word.hints.length; i++){
        if (word.hints[i].hinterId == hinterId){
          hint = word.hints[i];
          break;
        }
      }
      if(hintGuessWord.toUpperCase() == hint.word.toUpperCase()){
        //contact successfully, then reveal one more letter
        Words.update(curWordId, {$set : {revealedCount: word.revealedCount + 1}});
      }else{
        //contact failed, then add the word to used word, and remove hint
        Meteor.call('addUsedWord', hintGuessWord, curWordId);
      }
      Meteor.call('addUsedWord', hint.word, curWordId); 
      Meteor.call('removeHint', hinterId, curWordId);
    }, 2000);
    
  },
});