import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { BotConst } from 'src/lib/shared/ const/bot';
import {
  InlineKeyboardMarkup,
  ReplyKeyboardMarkup,
} from 'telegraf/typings/core/types/typegram';

@Injectable()
export class BotService {
  constructor(@InjectBot(BotConst.NAME) private readonly bot: any) {}

  async sendMessage(
    ctx: any,
    text: string,
    keyboard: { reply_markup: InlineKeyboardMarkup | ReplyKeyboardMarkup },
  ) {
    const { id: chatId } = ctx.chat;

    await this.bot.telegram.sendMessage(chatId, text, {
      parse_mode: 'HTML',
      ...keyboard,
    });
  }
}
