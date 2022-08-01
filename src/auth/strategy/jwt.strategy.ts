import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { validate } from "class-validator";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JwtStratety extends PassportStrategy(Strategy,'jwt',) {
    
    constructor(config: ConfigService, private prisma: PrismaService) {
        console.log(config.get('JWT_SECRET'))
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: config.get('JWT_SECRET'),
        });
      }
    
      async validate(payload: {sub: number, email:string}) {
        const user = await this.prisma.user.findUnique({
            where:{
                id:payload.sub,
            }
        });
        delete user.hash
        return user; // Req.user = payload // se retornar nyll vai gerar uma resposta 401 nao autorizado
      }

}
