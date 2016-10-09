import { Mongo } from 'meteor/mongo';

const Words = new Mongo.Collection('words');

// Words schema
// {
//   _id: String, // Mongo ID
//   holderId: String, // Mongo ID, userId
//   word: String,
//   revealedCount: int = 1, // max = word.length
//   hintCount: int, // max = word.length * 2
//   usedWords: Array of String = [],
//   winnerId: String, // Mongo ID, userId
//   hints: [ // max = 5
//     {
//       hinterId: String, // Mongo ID, userId
//       contactorId: String = null, // Mongo ID, userId
//       word: String,
//		 wordGuess: String,
//       hint: String,
//       guessCount: int,
//     }
//   ]
// }

// Users schema
// {
//   _id: String, // Mongo ID
//   username: String,
//   profile: {
//     scoreContactor: int,
//     scoreHolder: int,
//		scoreBoth: int
//   }
// }

export { Words };
