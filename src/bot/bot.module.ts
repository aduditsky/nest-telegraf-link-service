import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Session } from 'src/database/models/session.model';
import { Link } from 'src/database/models/link.model';
import { BotUpdate } from './scenes/update';
import { MenuScene } from './scenes/menu.scene';
import { SaveLinkScene } from './scenes/save-link.scene';
import { ListLinksScene } from './scenes/list-links.scene';
import { DeleteLinkScene } from './scenes/delete-link.scene';
import { GetLinkScene } from './scenes/get-link.scene';
import { LinkModule } from 'src/link/link.module';

@Module({
  imports: [SequelizeModule.forFeature([Session, Link]), LinkModule],
  controllers: [BotController],
  providers: [
    BotService,

    // Bot Scene
    BotUpdate,
    MenuScene,
    SaveLinkScene,
    ListLinksScene,
    DeleteLinkScene,
    GetLinkScene,
  ],
})
export class BotModule {}
