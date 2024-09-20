import { Module, NotFoundException } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LinkModule } from './link/link.module';
import { SequelizeModule } from '@nestjs/sequelize';

import { Postgres } from '@telegraf/session/pg';
import { PostgresAdapter } from 'kysely';
import { session } from 'telegraf';
import { BotConst } from './lib/shared/ const/bot';

const store = (config: ConfigService) => {
  return Postgres<PostgresAdapter>({
    database: config.get<string>('DB_NAME'),
    host: config.get<string>('DB_HOST'),
    user: config.get<string>('DB_USERNAME'),
    password: config.get<string>('DB_PASSWORD'),
    onInitError(err) {
      throw new NotFoundException(`Config value in not found`, err);
    },
  });
};

export const handleSessionKey = (ctx: any): string => {
  const botId = ctx.botInfo?.id;
  const userId = ctx.from?.id;
  const chatId = ctx.chat?.id;

  if (!botId || !userId || !chatId) {
    throw new Error('Not working');
  }

  return `${botId}:${userId}:${chatId}`;
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BotModule,
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadModels: true,
        synchronize: true,
        logging: false,
      }),
    }),
    TelegrafModule.forRootAsync({
      botName: BotConst.NAME,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAM_BOT_TOKEN'),
        middlewares: [
          session({
            store: store(configService),
            getSessionKey: handleSessionKey,
          }),
        ],
      }),
    }),
    LinkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
