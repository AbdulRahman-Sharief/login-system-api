import 'dotenv/config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from 'logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConnectionService } from './database-connection.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt-auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from './email/email.module';

@Module({
  // MailerModule.forRoot({
  //   transport: 'smtps://user@domain.com:pass@smtp.domain.com',
  //   defaults: {
  //     from: '"nest-modules" <modules@nestjs.com>',
  //   },
  //   template: {
  //     dir: __dirname + '/templates',
  //     adapter: new EjsAdapter(),
  //     options: {
  //       strict: true,
  //     },
  //   },
  // }),
  imports: [
    // MailerModule.forRootAsync({
    //   useFactory: () => ({
    //     transport:{
    //       host: 'smtp.elasticemail.com',
    //       port: 587,
    //       secure: false, // true for 465, false for other ports
    //       auth: {
    //         user: 'AbdulrahmanSharief2@gmail.com',
    //         pass: '2B3AA69EE14C26A834012A4C9DF097AA1417',
    //       },
    //       defaults: {
    //         from: 'AbdulrahmanSharief2@gmail.com',
    //       },
    //     },
    //   }),
    // }),
    MailerModule.forRoot({
      // transport: {
      //   host: String(process.env.MAIL_HOST),
      //   port: Number(process.env.MAIL_PORT),
      //   secure: false,
      //   auth: {
      //     user: process.env.MAIL_USER,
      //     pass: process.env.MAIL_PASS,
      //   },
      // },

      transport: `smtps://${process.env.MAIL_USER}:${process.env.MAIL_PASS}@${process.env.MAIL_HOST}`,

      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      // template: {
      //   dir: __dirname + './template/notification',
      //   adapter: new EjsAdapter({  inlineCssEnabled: true,}),
      //   options: {
      //     strict: true,
      //   },
      // }),
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConnectionService,
    }),
    AuthModule,
    UsersModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
