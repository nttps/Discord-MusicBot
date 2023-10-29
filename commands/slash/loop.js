const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
	.setName("loop")
	.setDescription("เปิดวนเพลงตอนนี้")
	.setRun(async (client, interaction, options) => {
		let channel = await client.getChannel(client, interaction);
		if (!channel) {
			return;
		}
		
		let player;
		if (client.manager) {
			player = client.manager.players.get(interaction.guild.id);
		} else {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setDescription("Lavalink node is not connected"),
				],
			});
		}
		
		if (!player) {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setDescription("Nothing is playing right now."),
				],
				ephemeral: true,
			});
		}
		
		if (player.setTrackRepeat(!player.trackRepeat)) {
			;
		}
		const trackRepeat = player.trackRepeat? "เปิด" : "ปิด";
		
		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription(`👍 | **ลูปเพลง \`${ trackRepeat }\`**`),
			],
		});
	});

module.exports = command;
