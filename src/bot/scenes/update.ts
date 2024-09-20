import { Injectable } from '@nestjs/common';
import { Ctx, Update, Start, Command, InjectBot } from 'nestjs-telegraf';
import { BotConst } from 'src/lib/shared/ const/bot';
import { Telegraf } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

@Injectable()
@Update()
export class BotUpdate {
  constructor(@InjectBot(BotConst.NAME) private readonly bot: Telegraf<any>) {}

  @Start()
  async start(@Ctx() ctx: SceneContext) {
    await this.setBotCommands();

    await ctx.reply('Welcome to the link storage bot!');
    await ctx.scene.enter('menu');
  }

  async setBotCommands() {
    await this.bot.telegram.setMyCommands([
      { command: 'menu', description: 'Open main menu' },
      { command: 'savelink', description: 'Save a new link' },
      { command: 'listlinks', description: 'List all saved links' },
      { command: 'deletelink', description: 'Delete a saved link' },
    ]);
  }

  @Command('menu')
  async onMenuCommand(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter('menu');
  }

  @Command('savelink')
  async onSaveLinkCommand(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter('save_link');
  }

  @Command('listlinks')
  async onListLinksCommand(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter('list_links');
  }

  @Command('deletelink')
  async onDeleteLinkCommand(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter('delete_link');
  }
}
