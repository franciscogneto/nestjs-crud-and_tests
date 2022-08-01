import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist:true})) // SInalizando para o nest usar a validacao globalmente se nao a validacao feita no dto nao funcionara como deveria
                                                           // whitelist = true -> elimina os campos que nao estamos precisando
                                                           // Elimina os campos que nao se encontram nos DTOs
  await app.listen(3000);
}
bootstrap();
