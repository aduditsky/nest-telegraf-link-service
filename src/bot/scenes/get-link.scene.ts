import { Wizard, WizardStep, Ctx, On } from 'nestjs-telegraf';
import { LinkService } from 'src/link/link.service';
import { Logger } from '@nestjs/common';
import { handleSessionKey } from 'src/app.module';

@Wizard('get_link')
export class GetLinkScene {
  constructor(private readonly linkService: LinkService) {}

  @WizardStep(1)
  async askForCode(@Ctx() ctx: any) {
    Logger.log('Enter to Scene', 'Get Link Wizard');
    await ctx.reply(
      'Please provide the code of the link you want to retrieve.',
    );
    ctx.wizard.next();
  }

  @WizardStep(2)
  @On('text')
  async processCode(@Ctx() ctx: any) {
    const code = ctx.message.text;
    Logger.log(`Received code: ${code}`, 'Get Link Wizard');

    const link = await this.linkService.getLinkByCode(code);

    if (!link) {
      await ctx.reply('Link with this code not found.');
      return ctx.scene.enter('menu');
    }

    const sessionKey = handleSessionKey(ctx);

    const message =
      sessionKey === link.session_key
        ? `Here is your link: \n${link.url}`
        : `Someone shared a link with you: \n${link.url}`;

    await ctx.reply(message);

    await ctx.scene.enter('menu');
  }
}
