import {Mongo} from 'meteor/mongo';

const Dictionary = new Mongo.Collection('dictionary');

export {Dictionary};
