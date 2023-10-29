const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
	.setName("skipto")
	.setDescription("เลือกเพลงที่ต้องการข้ามไปเล่น")
	.addNumberOption((option) =>
		option
			.setName("number")
			.setDescription("ตำแหน่งของเพลงที่จะข้ามไป")
			.setRequired(true),
	)
	
	.setRun(async (client, interaction, options) => {
		const args = interaction.options.getNumber("number");
		//const duration = player.queue.current.duration
		
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
						.setDescription("I'm not in a channel."),
				],
				ephemeral: true,
			});
		}
		
		await interaction.deferReply();
		
		const position = Number(args);
		
		try {
			if (!position || position < 0 || position > player.queue.size) {
				let thing = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription("❌ | ผิดตำแหน่ง!");
				return interaction.editReply({ embeds: [thing] });
			}
			
			player.queue.remove(0, position - 1);
			player.stop();
			
			let thing = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setDescription("✅ | ข้ามไปตำแหน่ง " + position);
			
			return interaction.editReply({ embeds: [thing] });
		} catch {
			if (position === 1) {
				player.stop();
			}
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(client.config.embedColor)
						.setDescription("✅ | ข้ามไปตำแหน่ง " + position + "แล้ว"),
				],
			});
		}
	});

module.exports = command;
