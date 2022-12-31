import { SlashCommandBuilder } from '@discordjs/builders';

const command_logs = new SlashCommandBuilder()
        .setName('logs')
        .setDescription('Get logs!');

export default command_logs.toJSON();