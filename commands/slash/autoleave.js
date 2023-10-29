const colors = require("colors");
const { MessageEmbed } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("autoleave")
  .setDescription("ออกจากห้องเมื่อไม่มีใครอยู่ในห้อง")
  .setRun(async (client, interaction) => {
    let channel = await client.getChannel(client, interaction);
    if (!channel) return;

    let player;
    if (client.manager)
      player = client.manager.players.get(interaction.guild.id);
    else
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("Lavalink node is not connected"),
        ],
      });

    if (!player) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("ไม่มีเพลงที่กำลังเล่นใน Playlist"),
        ],
        ephemeral: true,
      });
    }

    let autoLeaveEmbed = new MessageEmbed().setColor(client.config.embedColor);
    const autoLeave = player.get("autoLeave");
    player.set("requester", interaction.guild.me);

    if (!autoLeave || autoLeave === false) {
      player.set("autoLeave", true);
    } else {
      player.set("autoLeave", false);
    }
    autoLeaveEmbed
			.setDescription(`**ออกจากห้องอตััโนมัติ** \`${!autoLeave ? "เปิด" : "ปิด"}\``)
			.setFooter({
			  text: `บอทจะ ${!autoLeave ? "ออกอัตโนมัติ" : "ไม่ออกอัตโนมัติ"} เมื่อห้องนี้ว่าง.`
			});
    client.warn(
      `Player: ${player.options.guild} | [${colors.blue(
        "autoLeave"
      )}] has been [${colors.blue(!autoLeave ? "ENABLED" : "DISABLED")}] in ${
        client.guilds.cache.get(player.options.guild)
          ? client.guilds.cache.get(player.options.guild).name
          : "a guild"
      }`
    );

    return interaction.reply({ embeds: [autoLeaveEmbed] });
  });

module.exports = command;