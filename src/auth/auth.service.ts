import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "src/dto";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable({})
export class AuthService {

    constructor(private prisma: PrismaService, private jwt:JwtService, private config:ConfigService) {

    }
    async signin(dto: AuthDto) {

        const user = await this.prisma.user.findUnique({
            where:{
                email:dto.email,
            }
        });

        if(!user) 
            throw new ForbiddenException('Credentials Incorrect');

        const pwMatches = await argon.verify(user.hash, dto.password);

        if(!pwMatches) throw new ForbiddenException('Credentials Incorrect');

        
        return this.signToken(user.id,user.email);

    }
    async signup(dto: AuthDto) {
        const hash = await argon.hash(dto.password);
        try {

            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash: hash,
                },
                select: {
                    id: true,
                    email: true,
                    createdAt: true,
                }//Seleciono os campos que quero que retorne
            });
            // delete user.id //deletando o campo id
            return this.signToken(user.id,user.email);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken')
                } // Se for um erro de restricao do Unique
            }
            throw error
        }


    }

    async signToken(userId: number, email:string){
        const payload = {
            sub: userId,
            email,
        }

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: this.config.get('JWT_SECRET')
        });

        return {access_token:token}
    }
}