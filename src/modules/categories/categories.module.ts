import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategorySchema } from './interface/category.shema';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    MongooseModule.forFeature([
      { name: 'Category', schema: CategorySchema }
    ])
  ]
})
export class CategoriesModule { }
