import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { IsString } from 'class-validator';
import { StoreService } from '../store/store.service';

class CategoryDto {
  @IsString()
  name!: string;

  @IsString()
  slug!: string;
}

@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly store: StoreService) {}

  @Get()
  list() {
    return this.store.categories;
  }

  @Post()
  create(@Body() dto: CategoryDto) {
    const category = {
      id: crypto.randomUUID(),
      name: dto.name,
      slug: dto.slug,
    };
    this.store.categories.push(category);
    return category;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: CategoryDto) {
    const category = this.store.categories.find((c) => c.id === id);
    if (!category) return { message: 'Not found' };
    category.name = dto.name;
    category.slug = dto.slug;
    return category;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.store.categories = this.store.categories.filter((c) => c.id !== id);
    return { success: true };
  }
}
