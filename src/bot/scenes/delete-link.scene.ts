import { Wizard, WizardStep, Ctx, On } from 'nestjs-telegraf';
import { LinkService } from 'src/link/link.service';

@Wizard('delete_link')
export class DeleteLinkScene {
  constructor(private readonly linkService: LinkService) {}

  @WizardStep(1)
  async askForCode(@Ctx() ctx: any) {
    await ctx.reply('Please provide the code of the link you want to delete.');
    ctx.wizard.next();
  }

  @WizardStep(2)
  @On('text')
  async processCode(@Ctx() ctx: any) {
    const code = ctx.message.text;

    console.log('Received code for deletion:', code);
    const result = await this.linkService.deleteLinkByCode(code);

    if (result) {
      await ctx.reply('Link deleted successfully.');
    } else {
      await ctx.reply('Link with this code not found.');
    }

    await ctx.scene.enter('menu');
  }
}
