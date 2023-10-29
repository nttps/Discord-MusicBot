const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");
const ms = require("ms");

const command = new SlashCommand()
	.setName("seek")
	.setDescription("ข้ามไปเวลาที่กำหนดของเพลงนี้")
	.addStringOption((option) =>
		option
			.setName("time")
			.setDescription("เลือกเวลาที่ต้องการ เช่น 1h 30m | 2h | 80m | 53s")
			.setRequired(true),
	)
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
		
		await interaction.deferReply();

		const rawArgs = interaction.options.getString("time");
		const args = rawArgs.split(' ');
		var rawTime = [];
		for (i = 0; i < args.length; i++){
			rawTime.push(ms(args[i]));
		}
		const time = rawTime.reduce((a,b) => a + b, 0);
		const position = player.position;
		const duration = player.queue.current.duration;
		
		if (time <= duration) {
			player.seek(time);
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(client.config.embedColor)
						.setDescription(
							`⏩ | **${ player.queue.current.title }** ได้ ${
								time < position? "ย้อนกลับ" : "ข้าม"
							} ไปที่ **${ ms(time) }**`,
						),
				],
			});
		} else {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(client.config.embedColor)
						.setDescription(
							`ค้นหาเวลที่กำลังเล่นไม่เจอ เนื่องจากเกินเวลา หรือใส่ข้อมูลไม่ถูกต้อง กรุณาลองใหม่`,
						),
				],
			});
		}
	});

module.exports = command;
