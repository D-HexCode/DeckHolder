import { SlashCommandBuilder } from '@discordjs/builders';

const command_addDeck = new SlashCommandBuilder()
        .setName('adddeck')
        .setDescription('You can add your deck!')
        .addStringOption((option) => option
            .setName('type')
            .setDescription('Your decktype')
            .setRequired(true)
            .setChoices(
                {name: 'main', value: 'main'},
                {name: 'extra', value: 'extra'},
                {name: 'side', value: 'side'}
            ))
        .addAttachmentOption((option) => option
            .setName('image')
            .setDescription('Your deck image')
            .setRequired(true));

export default command_addDeck.toJSON();