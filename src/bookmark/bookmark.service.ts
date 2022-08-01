import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto } from '../dto';
import { EditBookmarkDto } from '../dto';

@Injectable()
export class BookmarkService {


    constructor(private prisma: PrismaService){}

    async getBookmarks(){
        const bookmarks = await this.prisma.bookmark.findMany();
        return bookmarks;
    }

    async getBookmarksById(userId: number, bookMarkId: number){
        const bookmarks = await this.prisma.bookmark.findFirst({
            where: {
                userId,
                id: bookMarkId
            }
        });
        return bookmarks;
    }

    async createBookmark(userId: number,dto:CreateBookmarkDto){
        const bookmark = await this.prisma.bookmark.create({
            data: {
                ...dto, 
                userId
            }
        });

        return bookmark;
    }


    async editBookmarkById(userId: number, bookMarkId: number, dto: EditBookmarkDto ){
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookMarkId
            }
        });
        
        if (bookmark.userId != userId)
            throw new ForbiddenException('Access to resource denied')
        
        return this.prisma.bookmark.update({
            where: {
                id: bookMarkId,
            }, data: {
                ...dto,
            }
        });
    }

    async deleteBookMarkById(bookMarkId: number, userId: number){
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookMarkId
            }
        });
        
        if (bookmark.userId != userId)
            throw new ForbiddenException('Access to resource denied')
        
            return this.prisma.bookmark.delete({
                where: {
                    id:bookMarkId
                }
            })
    }
}
