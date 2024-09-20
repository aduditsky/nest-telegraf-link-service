import { Scene, SceneEnter, Ctx, On } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene('menu')
export class MenuScene {
  @SceneEnter()
  async onEnter(@Ctx() ctx: SceneContext) {
    await ctx.reply('Choose an option:', {
      reply_markup: {
        keyboard: [
          [{ text: '➕ Save Link' }],
          [{ text: '📋 List Links' }],
          [{ text: '🗑️ Delete Link' }],
          [{ text: '🔍 Get Link by Code' }],
        ],
        resize_keyboard: true,
        one_time_keyboard: false,
      },
    });
  }

  @On('text')
  async onText(@Ctx() ctx: any) {
    const messageText = ctx.message?.text;

    switch (messageText) {
      case '➕ Save Link':
        return ctx.scene.enter('save_link');
      case '📋 List Links':
        return ctx.scene.enter('list_links');
      case '🗑️ Delete Link':
        return ctx.scene.enter('delete_link');
      case '🔍 Get Link by Code':
        return ctx.scene.enter('get_link');
      default:
        await ctx.reply(
          'Unknown command. Please choose an option from the menu.',
        );
    }
  }
}
