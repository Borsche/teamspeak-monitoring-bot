# Teamspeak-Monitoring Bot

This bot was created for a school project.

A Visualised Monitoring bot for Teamspeak with poke feature.

After a channel has been assigned to the bot the bot will create an image every time the status of a service updates to show the current status of a service.

A user can register himself to be notified when a service will change its status to unavailable.
Users which a registered for this and online while this happens will be poked with a status message by the bot.

## Available Commands
```
    "Service: \n"+
    "   addService {ip}:{port} {name}   | adds a service\n"+
    "   rmService {ip}                  | removes a service\n"+
    "User: \n"+
    "   addUser {username}              | allows a user to use all commands\n"+
    "   rmUser {username}               | revokes rights from a user\n"+
    "Channel: \n"+
    "   setChannel {id}                 | sets a channel for monitoring\n"+
    "   getChannelId {name}             | retrieves the channel id\n"
```

You'll need to add a config.json file with your TS3 Server Query credentials. For an example look at [config.example.json](./config.example.json).
