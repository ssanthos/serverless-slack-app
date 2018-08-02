'use strict';

// Include the serverless-slack bot framework
const slack = require('serverless-slack');


// The function that AWS Lambda will call
exports.handler = slack.handler.bind(slack);


// Slash Command handler
slack.on('/greet', (msg, bot) => {
  let message = {
    text: "How would you like to greet the channel?",
    attachments: [{
      fallback: 'actions',
      callback_id: "greetings_click",
      actions: [
        { type: "button", name: "Wave", text: ":wave:", value: ":wave:" },
        { type: "button", name: "Hello", text: "Hello", value: "Hello" },
        { type: "button", name: "Howdy", text: "Howdy", value: "Howdy" },
        { type: "button", name: "Hiya", text: "Hiya", value: "Hiya" }
      ]
    }]
  };

  // ephemeral reply
  bot.replyPrivate(message);
});

slack.on('/register', (msg, bot) => {
    let message = {
      text: "How would you like to greet the channel?",
      attachments: [{
        fallback: 'actions',
        callback_id: "greetings_click",
        actions: [
          { type: "button", name: "Wave", text: ":wave:", value: ":wave:" },
          { type: "button", name: "Hello", text: "Hello", value: "Hello" },
          { type: "button", name: "Howdy", text: "Howdy", value: "Howdy" },
          { type: "button", name: "Hiya", text: "Hiya", value: "Hiya" }
        ]
      }]
    };

    // ephemeral reply
    bot.replyPrivate(message);
})

async function askToRegister() {

}

function isInStr(searchKeys, searchStr) {
    return !!searchKeys.find(key => searchStr.includes(key))
}

// mention event
slack.on('app_mention', async (payload, bot) => {

    try {
        console.log(JSON.stringify(payload, null, 2));

        const { user, type, text } = payload.event

        if (type === "app_mention") {

            const saidHi = isInStr(['hey', 'hi', 'hello'], text.toLowerCase())

            if (saidHi) {

                // const data = await slack.store.get(`user_${user}`)
                //
                // if (data) {
                //
                // }

                await bot.reply({
                    text: ':wave: You called on me?',
                    // attachments: [{
                    //   fallback: 'actions',
                    //   callback_id: "actions_click",
                    //   actions: [
                    //     { type: "button", name: "Register", text: ":wave:", value: ":wave:" },
                    //     { type: "button", name: "AddProgress", text: "Hiya", value: "Hiya" }
                    //   ]
                    // }]
                })
            }
        }
    } catch (err) {
        console.error(err);
    }
})

slack.on('messages.channel', (payload, bot) => {

})


// Interactive Message handler
slack.on('actions_click', (msg, bot) => {
    console.log(JSON.stringify(msg, null, 2));
  let message = {
    // selected button value
    text: msg.actions[0].value
  };

  // public reply
  bot.reply(message);
});


// Reaction Added event handler
slack.on('reaction_added', (msg, bot) => {
  bot.reply({
    text: ':wave:'
  });
});
