import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { EditUserDto } from '../dto/edit-user.dto';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';

@UseGuards(JwtGuard) // Usando o o guard do tipo AUthGuard do tipo jwt -> GUards ficam entre o handler da requisicao e a requisicao
@Controller('users')
export class UserController {

    constructor(private userService:UserService){}

    @Get('me')//Se deixar o get em branco, ira pegar qualquer coisa que vir em '/users'
    getMe(@GetUser() user: User){

        return user;
    }

    @Patch()
    editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto){
        console.log({userId,dto});
        return this.userService.editUser(userId, dto);
    }

}
