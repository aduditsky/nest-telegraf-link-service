import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LinkService } from './link.service';
import { LinkController } from './link.controller';
import { Link } from 'src/database/models/link.model';

@Module({
  imports: [SequelizeModule.forFeature([Link])],
  providers: [LinkService],
  controllers: [LinkController],
  exports: [LinkService],
})
export class LinkModule {}
