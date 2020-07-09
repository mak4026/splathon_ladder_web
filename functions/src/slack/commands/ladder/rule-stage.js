const admin = require ('../../init');

const useLadderStageCommand = (app) => {
  app.command('/ladder-stage', async ({ack, say }) => {
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
      "response_type": "in_channel",
      "text": text,
      "attachments": [{
        "blocks":blocks
      }]
    };

    await say(response);
    await ack();
  });
};



module.exports = useLadderStageCommand;