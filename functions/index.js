'use strict'
const functions = require('firebase-functions');
const expressReceiver = require('./src/slack/app');

// https://us-central1-splathon-ladder.cloudfunctions.net/slack/events
exports.slack = functions.https.onRequest(expressReceiver.app);