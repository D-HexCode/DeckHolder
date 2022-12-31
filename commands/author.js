import { SlashCommandBuilder } from '@discordjs/builders';

const command_author = new SlashCommandBuilder()
        .setName('author')
        .setDescription('My author');

export default command_author.toJSON();