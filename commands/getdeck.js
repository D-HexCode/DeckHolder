import { SlashCommandBuilder } from '@discordjs/builders';

const command_getDeck = new SlashCommandBuilder()
        .setName('getdeck')
        .setDescription('You can get anybody\'s deck, if you have permission!')
        .addUserOption((option) => option
            .setName('user')
            .setDescription('Whose deck?')
            .setRequired(true));

export default command_getDeck.toJSON();