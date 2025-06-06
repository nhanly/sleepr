import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(PaymentModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get<string>('PORT'),
    },
  });

  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
}
bootstrap();
