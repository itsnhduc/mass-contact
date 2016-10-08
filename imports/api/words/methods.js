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
  'addHint'(hinterId, curWord, hint, hintWord) {
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
	}

});
