import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { CreateBookmarkDto } from '../dto';
import { EditBookmarkDto } from '../dto';
import { BookmarkService } from './bookmark.service';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {

    constructor(private bookService:BookmarkService){

    }

    @Get()
    getBookmarks(@GetUser('id') userId:number){
        return this.bookService.getBookmarks();
    }

    @Get(':id')
    getBookmarkById(@GetUser('id') userId:number, @Param('id', ParseIntPipe) bookmarkId: number){
        return this.bookService.getBookmarksById(userId, bookmarkId);

    }

    @Post()
    createBookmark(@GetUser('id') userId: number, @Body() dto: CreateBookmarkDto){
        return this.bookService.createBookmark(userId, dto);
    }

    @Patch(':id')
    editBookmarkById(@GetUser('id') userId:number, @Param('id', ParseIntPipe) bookmarkId: number, @Body() dto: EditBookmarkDto){
        return this.bookService.editBookmarkById(userId,bookmarkId,dto)
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteBookMarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookMarkId: number){
        return this.bookService.deleteBookMarkById(bookMarkId,userId);
    }
}
