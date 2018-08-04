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

function isInStr(searchKeys, searchStr) {
    if (typeof searchKeys === 'string') {
        searchKeys = [ searchKeys ]
    }
    const words = searchStr.split(' ').map(v => v.trim().toLowerCase()).filter(v => !!v)
    return !!searchKeys.find(key => !!words.find(w => w === key))
}

// mention event
slack.on('app_mention', async (payload, bot) => {

    try {
        console.log('app_mention');
        console.log(JSON.stringify(payload, null, 2));

        const { user, type, text } = payload.event

        if (type === "app_mention") {

            const saidHi = isInStr(['hey', 'hi', 'hello'], text)

            if (saidHi) {

                const data = await slack.store.get(`user_${user}`)

                if (data) {
                    console.log('data', JSON.stringify(data));
                } else {
                    console.log('NO data');
                }

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

function identifyRequest(text) {
    if (isInStr(['register'], text)) {
        return 'register'
    } else if (isInStr(['update', 'updates', 'progress'], text)) {
        return 'update'
    } else if (isInStr(['help'], text)) {
        return 'help'
    } else if (isInStr(['pot'], text)) {
        return 'pot'
    } else if (isInStr(['account', 'balance'], text)) {
        return 'balance'
    }
}

// Messages
slack.on('message', (payload, bot) => {
    try {
        console.log('message');
        console.log(JSON.stringify(payload, null, 2));

        const { channel_type, user, text } = payload.event
        if (channel_type === 'im') {
            // Direct message

            if (identifyRequest(text) === 'help') {

                bot.say({
                    text : `I'm here to help`,
                    attachments: JSON.stringify([
                        {
                            "text": "What do you wanna do?",
                            "fallback": "You are unable to make a choice",
                            "callback_id": "help_action_click",
                            "color": "#3AA3E3",
                            "attachment_type": "default",
                            "actions": [
                                {
                                    "name": "help",
                                    "text": "Register",
                                    "type": "button",
                                    "value": "register"
                                },
                                {
                                    "name": "help",
                                    "text": "Peek into the pot",
                                    "type": "button",
                                    "value": "check_pot"
                                },
                                {
                                    "name": "help",
                                    "text": "Post my progress",
                                    "type": "button",
                                    "value": "post_progress",
                                },
                            ]
                        }
                    ])
                })

            } else {
                // Check for trigger words
                bot.say({
                    text : `I don't have a clue about what you just said. Ask me about things I know - like help`
                })
            }
        } else if (channel_type === 'channel') {
            // bot.say({
            //     text : `Did you ask me this? - _${text}_`
            // })
        }
    } catch (err) {
        console.error(err);
    }
})


// Interactive Message handler
slack.on('help_action_click', (msg, bot) => {
    try {
        console.log(JSON.stringify(msg, null, 2));
    } catch (err) {
        console.log(err);
    }
  // let message = {
  //   // selected button value
  //   text: msg.actions[0].value
  // };
  //
  // // public reply
  // bot.reply(message);
});


// Reaction Added event handler
slack.on('reaction_added', (msg, bot) => {
  bot.reply({
    text: ':wave:'
  });
});
