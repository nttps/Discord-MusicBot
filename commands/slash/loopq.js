const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
	.setName("loopq")
	.setDescription("วนลูปเพลงในคิวทั้งหมด")
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
						.setDescription("There is no music playing."),
				],
				ephemeral: true,
			});
		}
		
		if (player.setQueueRepeat(!player.queueRepeat)) {
			;
		}
		const queueRepeat = player.queueRepeat? "เปิด" : "ปิด";
		
		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription(
						`:thumbsup: | **วนลูปคิวตอนนี้ \`${ queueRepeat }\`**`,
					),
			],
		});
	});

module.exports = command;
