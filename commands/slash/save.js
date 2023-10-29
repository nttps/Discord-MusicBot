const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");

const command = new SlashCommand()
	.setName("save")
	.setDescription("บันทึกเพลงตอนนี้ไปที่ DM")
	.setRun(async (client, interaction) => {
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
						.setDescription("There is no music playing right now."),
				],
				ephemeral: true,
			});
		}
		
		const sendtoDmEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setAuthor({
				name: "บันทึกเพลง",
				iconURL: `${ interaction.user.displayAvatarURL({ dynamic: true }) }`,
			})
			.setDescription(
				`**บันทึก [${ player.queue.current.title }](${ player.queue.current.uri }) ไปที่แชทแล้ว**`,
			)
			.addFields(
				{
					name: "เวลา",
					value: `\`${ prettyMilliseconds(player.queue.current.duration, {
						colonNotation: true,
					}) }\``,
					inline: true,
				},
				{
					name: "นักร้อง",
					value: `\`${ player.queue.current.author }\``,
					inline: true,
				},
				{
					name: "ขอจาก",
					value: `\`${ interaction.guild }\``,
					inline: true,
				},
			);
		
		interaction.user.send({ embeds: [sendtoDmEmbed] });
		
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription(
						"กรุณาตรวจดู **DMs**. ถ้าไม่มีข้อความเช็คให้แน่ใว่า **DMs** เปิดอยู่",
					),
			],
			ephemeral: true,
		});
	});

module.exports = command;
