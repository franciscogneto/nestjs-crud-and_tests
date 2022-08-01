import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService] //LIberando o modulo para exportar teu service
})
export class PrismaModule {}
