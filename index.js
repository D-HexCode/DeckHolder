import { config } from 'dotenv';
import { Client, GatewayIntentBits, Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import CommandAddDeck from './commands/adddeck.js';
import CommandGetDeck from './commands/getdeck.js';
import CommandParticipants from './commands/participants.js';
import CommandLogs from './commands/logs.js';
import CommandAuthor from './commands/author.js';
config();

const client = new Client({intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent]});

var deckslots = [];
var logs = [];
var i=0;

client.on('ready', () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    logs += 'Bot is ready since: ' + getTimeForLogs() + '\n';
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    
    if (interaction.commandName === 'adddeck') {
        for (i=0; i<deckslots.length; i++) {
            if (deckslots[i][0] == interaction.user.id) {
                if (interaction.options.getString('type') == 'main')
                    deckslots[i][1] = interaction.options.getAttachment('image').url;
                if (interaction.options.getString('type') == 'extra')
                    deckslots[i][2] = interaction.options.getAttachment('image').url;
                if (interaction.options.getString('type') == 'side')
                    deckslots[i][3] = interaction.options.getAttachment('image').url;
                logs += interaction.user.username + ' ' + interaction.options.getString('type') +': ' + getTimeForLogs() + '\n';
                interaction.reply('Your deck is updated!');
                return;
            }
        }

        var arrnew = [interaction.user.id, '', '', ''];

        if (interaction.options.getString('type') == 'main')
            arrnew[1] = interaction.options.getAttachment('image').url;
        if (interaction.options.getString('type') == 'extra')
            arrnew[2] = interaction.options.getAttachment('image').url;
        if (interaction.options.getString('type') == 'side')
            arrnew[3] = interaction.options.getAttachment('image').url;

        deckslots.push(arrnew);
        logs += interaction.user.username + ' ' + interaction.options.getString('type') +': ' + getTimeForLogs() + '\n';
        interaction.reply('You are a tournament participant now!');
    }

    if (interaction.commandName == 'getdeck') {
        var userID = interaction.user.id;

        if (interaction.options.getUser('user').id == interaction.user.id) {
            for (i=0; i<deckslots.length; i++) {
                if (interaction.user.id == deckslots[i][0]) {
                    var content = '';
                    if (deckslots[i][1] != '') content += 'Main deck: ' + deckslots[i][1] + '\n';
                    if (deckslots[i][2] != '') content += 'Extra deck: ' + deckslots[i][2] + '\n';
                    if (deckslots[i][3] != '') content += 'Side deck: ' + deckslots[i][3];
                    interaction.reply(content);
                    return;
                }
            }
            interaction.reply('It seems you don\'t have a deck.');
            return;
        } else {
            if (!interaction.inGuild()) {
                interaction.reply('Do you want a deck idea from me?! Play INFERNITIES!!!');
                return;
            } else {
                if (!interaction.member.roles.cache.has(process.env.ROLE_ID)){
                    interaction.reply('You don\'t have a permission!');
                    return;
                } else {
                    for (i=0; i<deckslots.length; i++) {
                        if (interaction.options.getUser('user').id == deckslots[i][0]) {
                            var content = '';
                            if (deckslots[i][1] != '') content += 'Main deck: ' + deckslots[i][1] + '\n';
                            if (deckslots[i][2] != '') content += 'Extra deck: ' + deckslots[i][2] + '\n';
                            if (deckslots[i][3] != '') content += 'Side deck: ' + deckslots[i][3];
                            interaction.reply(content);
                            return;
                        }
                    }
                    interaction.reply('It seems he/she doesn\'t have a deck.');
                    return;
                }
            }
        }
    }

    if (interaction.commandName == 'participants') {
        if (!interaction.inGuild()) {
            interaction.reply('You cannot use this command in DM!');
            return;
        }

        var content = 'Participant number: ' + deckslots.length;
        for (i=0; i<deckslots.length; i++) {
            if (!interaction.guild.members.fetch(deckslots[i][0])) {
                content += '\n' + deckslots[i][0];
            } else {
                var uname = (await interaction.guild.members.fetch(deckslots[i][0])).user.username;
                content += '\n' + uname;
            }
            if (deckslots[i][1] == '') content += ' m:-';
            else content += ' m:+';
            if (deckslots[i][2] == '') content += ' e:-';
            else content += ' e:+';
            if (deckslots[i][3] == '') content += ' s:-';
            else content += ' s:+';
        }

        interaction.reply(content);
    }

    if (interaction.commandName == 'logs') {
        var dcMaxCharLimit = 1800;
        var loggi = Math.floor(logs.length / dcMaxCharLimit);
        for (i=0; i<loggi; i++) 
            interaction.channel.send(logs.substring(dcMaxCharLimit*i, dcMaxCharLimit*(i+1)));
        interaction.reply(logs.substring(dcMaxCharLimit*loggi, logs.length));
    }

    if (interaction.commandName == 'author') {
        interaction.reply('I was made by HexCode#3764!');
    }

});

const rest = new REST({version:'10'}).setToken(process.env.BOT_TOKEN);

async function main() {

    const commands = [CommandAddDeck, CommandGetDeck, CommandParticipants, CommandLogs, CommandAuthor];

    try {
        console.log('Started refreshing application (/) commands.');
        /*
        await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
            body: commands });
        */
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
            body: commands });
        
        client.login(process.env.BOT_TOKEN);
    } catch (err) {}
}

function getTimeForLogs(){
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    return date + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds;
}

main();