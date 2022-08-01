import { Body, Controller, HttpCode, HttpStatus, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { AuthDto } from "../dto";
import { AuthService } from "./auth.service";

// Pipes -> Funcoes que transformam seus dados

// /auth
@Controller('auth')
export class AuthController {

    // Dependy injection
    constructor(private authService: AuthService) {
        //private == declare and assign authService variable --> this.authService
    }

    // /auth/signup
    @Post('signup')
    signup(@Body() dto: AuthDto) { //Acessando o Corpo do requisicao atraves do decorator Body (express object)
        //Cria usuario
        return this.authService.signup(dto)
    }

    // /auth/signin
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    async signin(@Body() dto: AuthDto) {


        return await this.authService.signin(dto)
    }
}