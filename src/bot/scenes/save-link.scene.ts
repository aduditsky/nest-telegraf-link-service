import { Wizard, WizardStep, Ctx, On } from 'nestjs-telegraf';
import { handleSessionKey } from 'src/app.module';
import { isValidUrl } from 'src/lib/shared/validation/url';
import { LinkService } from 'src/link/link.service';

@Wizard('save_link')
export class SaveLinkScene {
  constructor(private readonly linkService: LinkService) {}

  @WizardStep(1)
  async onEnter(@Ctx() ctx: any) {
    await ctx.reply('Please send me a link you want to save.');
    ctx.wizard.next();
  }

  @WizardStep(2)
  @On('text')
  async onValidateLink(@Ctx() ctx: any) {
    const url = ctx.message.text;

    if (!isValidUrl(url)) {
      await ctx.reply(`Validation failed: The link must be a valid URL.`);
      return;
    }

    ctx.wizard.state.link = url;
    await ctx.reply('Now, please provide a name for the link.');
    ctx.wizard.next();
  }

  @WizardStep(3)
  @On('text')
  async onSaveName(@Ctx() ctx: any) {
    const name = ctx.message.text;

    if (!name || name.trim() === '') {
      await ctx.reply(
        'Validation failed: The name cannot be empty. Please provide a valid name. ',
      );
      return;
    }
    ctx.wizard.state.name = name;

    await ctx.reply(
      `You provided the name: ${name}. Do you want to save the link?`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Yes', callback_data: 'yes' },
              { text: 'No', callback_data: 'no' },
            ],
          ],
        },
      },
    );
    ctx.wizard.next();
  }

  @WizardStep(4)
  @On('callback_query')
  async onConfirmSave(@Ctx() ctx: any) {
    const confirmation = ctx.callbackQuery.data;

    if (confirmation === 'no') {
      await ctx.reply('Link not saved. Returning to menu.');
      ctx.scene.enter('menu');
    } else if (confirmation === 'yes') {
      const name = ctx.wizard.state.name;
      const session_key = handleSessionKey(ctx);
      const link = ctx.wizard.state.link;

      const savedLink = await this.linkService.createLink(
        session_key,
        name,
        link,
      );

      await ctx.reply(
        `Link saved with name: ${name}, URL: ${link}, and code: ${savedLink.code}`,
      );
      ctx.scene.enter('menu');
    }
  }
}
