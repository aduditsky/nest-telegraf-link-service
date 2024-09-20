import { Logger } from '@nestjs/common';
import { Scene, SceneEnter, Action, Ctx } from 'nestjs-telegraf';
import { handleSessionKey } from 'src/app.module';
import { escapeMarkdown } from 'src/lib/shared/utils/markdown';
import { LinkService } from 'src/link/link.service';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene('list_links')
export class ListLinksScene {
  private readonly pageSize = 5;

  constructor(private readonly linkService: LinkService) {}

  @SceneEnter()
  async onEnter(@Ctx() ctx: SceneContext) {
    Logger.log('Enter to Scene', 'List Links');
    const session_key = handleSessionKey(ctx);

    try {
      await ctx.deleteMessage();
    } catch (error) {
      Logger.error('Failed to delete message:', error);
    }

    await this.sendPage(ctx, session_key, 1);
  }

  async sendPage(ctx: SceneContext, session_key: string, page: number) {
    const { links, totalPages } = await this.linkService.getAllLinksForSession(
      session_key,
      page,
      this.pageSize,
    );

    const linkList = links
      .map(({ name, url, code }) => {
        return `*Name:* ${escapeMarkdown(name)}\n*Link:* ${escapeMarkdown(url)}\n\`${escapeMarkdown(code)}\``;
      })
      .join('\n\n');

    const buttons = [];
    if (page > 1) {
      buttons.push({ text: '⬅️ Previous', callback_data: `prev_${page}` });
    }
    if (page < totalPages) {
      buttons.push({ text: 'Next ➡️', callback_data: `next_${page}` });
    }

    await ctx.replyWithMarkdownV2(linkList, {
      reply_markup: {
        inline_keyboard: [buttons],
      },
    });
    if (!buttons.length) {
      return ctx.scene.enter('menu');
    }
  }

  @Action(/prev_(\d+)/)
  async onPreviousPage(@Ctx() ctx: any) {
    console.log('onPreviousPage');
    const session_key = handleSessionKey(ctx);
    const currentPage = Number(ctx.match[1]);
    const previousPage = currentPage - 1;

    await ctx.deleteMessage();
    await this.sendPage(ctx, session_key, previousPage);
  }

  @Action(/next_(\d+)/)
  async onNextPage(@Ctx() ctx: any) {
    console.log('onNextPage');
    const session_key = handleSessionKey(ctx);
    const currentPage = Number(ctx.match[1]);
    const nextPage = currentPage + 1;

    await ctx.deleteMessage();
    await this.sendPage(ctx, session_key, nextPage);
  }
}
