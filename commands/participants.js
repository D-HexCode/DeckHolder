import { SlashCommandBuilder } from '@discordjs/builders';

const command_participants = new SlashCommandBuilder()
        .setName('participants')
        .setDescription('Get participants!');

export default command_participants.toJSON();