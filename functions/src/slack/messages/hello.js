// Listens to incoming messages that contain "hello"
const useHelloMessage = (app) => {
  app.message('hello', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say(`Hey there <@${message.user}>!`);
  });
};

module.exports = useHelloMessage;