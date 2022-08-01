import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable() // Qualquer classe que usar injecao de dependencia precisa ter esse decorator
export class PrismaService extends PrismaClient {

    constructor(config: ConfigService) {
        super(
            {
                datasources: {
                    db: {
                        url: config.get('DATABASE_URL'),
                    }
                }
            }
        )
    }

    cleanDb(){
        return this.$transaction([
            this.bookmark.deleteMany(),
            this.user.deleteMany(),
        ]);
    }
}
