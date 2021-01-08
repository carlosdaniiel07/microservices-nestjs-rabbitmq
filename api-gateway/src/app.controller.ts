import { BadRequestException, Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { CreateCategoryDto } from './dtos/categories/create-category.dto';
import { UpdateCategoryDto } from './dtos/categories/update-category.dto';
import { CreateChallengeDto } from './dtos/challenges/create-challenge.dto';
import { CreatePlayerDto } from './dtos/players/create-player.dto';
import { UpdatePlayerDto } from './dtos/players/update-player.dto';
import { ProxyService } from './modules/proxy/proxy.service';
import { StorageService } from './modules/storage/storage.service';
import { MongoIdValidationPipe } from './pipes/pipes/mongo-id-validation.pipe';

@Controller('api/v1')
export class AppController {
  private readonly logger = new Logger(AppController.name)

  constructor(
    private readonly storageService: StorageService,
    private readonly proxyService: ProxyService,
  ) {}

  @Get('categories')
  findCategories(): Observable<any[]> {
    return this.proxyService.adminMicroservice.send('find-all-categories', '')
  }

  @Get('categories/:id')
  findCategoryById(@Param('id', MongoIdValidationPipe) id: string): Observable<any> {
    return this.proxyService.adminMicroservice.send('find-category-by-id', id)
  }

  @Post('categories')
  @UsePipes(ValidationPipe)
  saveCategory(@Body() createCategoryDto: CreateCategoryDto): void {
    this.proxyService.adminMicroservice.emit('create-category', createCategoryDto)
  }

  @Put('categories/:id')
  @UsePipes(ValidationPipe)
  updateCategory(@Param('id', MongoIdValidationPipe) id: string, @Body() updateCategoryDto: UpdateCategoryDto): void {
    this.proxyService.adminMicroservice.emit('update-category', { id, data: updateCategoryDto })
  }

  @Post('categories/:id/players/:playerId')
  addPlayerToCategory(@Param('id', MongoIdValidationPipe) id: string, @Param('playerId', MongoIdValidationPipe) playerId: string): void {
    this.proxyService.adminMicroservice.emit('add-player-to-category', { id, playerId })
  }

  @Get('players')
  findPlayers(): Observable<any[]> {
    return this.proxyService.adminMicroservice.send('find-all-players', '')
  }

  @Get('players/:id')
  findPlayerById(@Param('id', MongoIdValidationPipe) id: string): Observable<any> {
    return this.proxyService.adminMicroservice.send('find-player-by-id', id)
  }

  @Post('players')
  @UsePipes(ValidationPipe)
  savePlayer(@Body() createPlayerDto: CreatePlayerDto): void {
    this.proxyService.adminMicroservice.emit('create-player', createPlayerDto)
  }

  @Put('players/:id')
  @UsePipes(ValidationPipe)
  updatePlayer(@Param('id', MongoIdValidationPipe) id: string, @Body() updatePlayerDto: UpdatePlayerDto): void {
    this.proxyService.adminMicroservice.emit('update-player', { id, data: updatePlayerDto })
  }

  @Delete('players/:id')
  deletePlayer(@Param('id', MongoIdValidationPipe) id: string): void {
    this.proxyService.adminMicroservice.emit('delete-player', id)
  }

  @Put('players/:id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPlayerProfilePhoto(
    @UploadedFile() file: any,
    @Param('id', MongoIdValidationPipe) id: string
  ): Promise<void> {
    const player = await this.proxyService.adminMicroservice.send('find-player-by-id', id).toPromise()
    
    if (!player) {
      throw new BadRequestException('Jogador não encontrado')
    }

    const fileUrl = await this.storageService.uploadFile(file, id)
    const updatePlayerDto: UpdatePlayerDto = { photo: fileUrl }
    
    this.proxyService.adminMicroservice.emit('update-player', { id, data: updatePlayerDto })
  }

  @Get('challenges')
  findChallenges(@Query('player') player: string): Observable<any[]> {
    return this.proxyService.challengeMicroservice.send('find-all-challenges', '')
  }

  @Get('challenges/:id')
  findChallengeById(@Param('id', MongoIdValidationPipe) id: string): Observable<any> {
    return this.proxyService.challengeMicroservice.send('find-challenge-by-id', id)
  }

  @Post('challenges')
  @UsePipes(ValidationPipe)
  createChallenge(@Body() createChallengeDto: CreateChallengeDto): void {
    this.proxyService.challengeMicroservice.emit('create-challenge', createChallengeDto)
  }
}
