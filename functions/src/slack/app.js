const functions = require('firebase-functions');
const { App, ExpressReceiver } = require ('@slack/bolt');
const useBattleThreadMessage = require ('./messages/ladder/battle-thread');
const useLadderStageCommand = require ('./commands/ladder/rule-stage');

const config = functions.config();

const expressReceiver = new ExpressReceiver({
  signingSecret: config.slack.signing_secret,
  endpoints: '/events',
  processBeforeResponse: true
});

const app = new App({
  receiver: expressReceiver,                      // local実行時はここをコメントアウト
  // signingSecret: config.slack.signing_secret,　// local実行時はここのコメントアウトを外す
  token: config.slack.bot_token,
  processBeforeResponse: true
});
app.error(console.log);

// local で実行する際にここをコメントアウトから外す必要がある
// (async () => {
//   // Start your app
//   await app.start(3000);

//   console.log('⚡️ Bolt app is running!');
// })();

useBattleThreadMessage(app);
useLadderStageCommand(app);

module.exports = expressReceiver;