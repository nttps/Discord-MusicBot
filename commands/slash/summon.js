const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
	.setName("summon")
	.setDescription("เรียกบอทเข้าห้อง")
	.setRun(async (client, interaction, options) => {
		let channel = await client.getChannel(client, interaction);
		if (!interaction.member.voice.channel) {
			const joinEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setDescription(
					"❌ | **ต้องอยู่ในห้องพูดคุย**",
				);
			return interaction.reply({ embeds: [joinEmbed], ephemeral: true });
		}
		
		let player = client.manager.players.get(interaction.guild.id);
		if (!player) {
			player = client.createPlayer(interaction.channel, channel);
			player.connect(true);
		}
		
		if (channel.id !== player.voiceChannel) {
			player.setVoiceChannel(channel.id);
			player.connect();
		}
		
		interaction.reply({
			embeds: [
				client.Embed(`:thumbsup: | **เข้า <#${ channel.id }> แล้ว!**`),
			],
		});
	});

module.exports = command;
