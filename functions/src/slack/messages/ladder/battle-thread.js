const admin = require ('../../init');

const useBattleThreadMessage = (app) => {
  app.message('対戦スレ', async ({ message, ack, say }) => {
    const channelId = 'CBK6A95UJ';
    if　(message.channel == channelId) {
      const season = 5;
      const db = admin.firestore();
      const seasonDoc = await db.collection(`tournaments`).doc(`spladder${season}`).get();    
      const currentRound = seasonDoc.data().currentRound;
      const ruleDoc = await db.collection(`tournaments/spladder${season}/rules`).doc(`${currentRound}`).get();
      const text = `シーズン：#${season} ラウンド：${currentRound}`;

      let blocks = [];
      let index = 1;
      ruleDoc.data().settings.forEach(setting => {
        var spaceCnt = 8 - setting.rule.length;
        var space = '';
        for(let sc = 0; sc < spaceCnt; sc++){
          space += '　';
        }
        blocks.push(
          {
            "type": "section",
            "text": {
              "type": "plain_text",
              "text": `${index} ${setting.rule}${space}${setting.stage}`
            }
          }
        );
        index++;
      });

      const response = {
        "channel": message.channel,
        "text": text,
        "attachments": [{
          "blocks":blocks
        }],
        "thread_ts": message.ts
      };

      await say(response);
    };
    await ack();
  });
};

module.exports = useBattleThreadMessage;