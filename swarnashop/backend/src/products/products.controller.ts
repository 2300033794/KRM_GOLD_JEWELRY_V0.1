import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { StoreService } from '../store/store.service';

class ProductDto {
  @IsString() name!: string;
  @IsString() slug!: string;
  @IsString() description!: string;
  @IsString() purity!: string;
  @IsNumber() weightGrams!: number;
  @IsNumber() makingCharge!: number;
  @IsNumber() wastagePerc!: number;
  @IsString() categoryId!: string;
  @IsNumber() stock!: number;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

@Controller('api/products')
export class ProductsController {
  constructor(private readonly store: StoreService) {}

  @Get()
  list(@Query('category') category?: string, @Query('purity') purity?: string) {
    return this.store.products.filter(
      (p) =>
        (!category || p.categoryId === category) &&
        (!purity || p.purity === purity),
    );
  }

  @Get(':slug')
  get(@Param('slug') slug: string) {
    return (
      this.store.products.find((p) => p.slug === slug) ?? {
        message: 'Not found',
      }
    );
  }

  @Post()
  create(@Body() dto: ProductDto) {
    const product = {
      ...dto,
      id: crypto.randomUUID(),
      isActive: dto.isActive ?? true,
      isFeatured: dto.isFeatured ?? false,
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.store.products.push(product);
    return product;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: ProductDto) {
    const product = this.store.products.find((p) => p.id === id);
    if (!product) return { message: 'Not found' };
    Object.assign(product, dto, { updatedAt: new Date().toISOString() });
    return product;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.store.products = this.store.products.filter((p) => p.id !== id);
    return { success: true };
  }

  @Post(':id/images')
  uploadImage(@Param('id') id: string) {
    const product = this.store.products.find((p) => p.id === id);
    if (!product) return { message: 'Not found' };
    const image = {
      id: crypto.randomUUID(),
      url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      publicId: 'sample',
      isPrimary: product.images.length === 0,
    };
    product.images.push(image);
    return image;
  }

  @Delete(':id/images/:imgId')
  deleteImage(@Param('id') id: string, @Param('imgId') imgId: string) {
    const product = this.store.products.find((p) => p.id === id);
    if (!product) return { message: 'Not found' };
    product.images = product.images.filter((img) => img.id !== imgId);
    return { success: true };
  }

  @Patch(':id/images/:imgId/primary')
  setPrimary(@Param('id') id: string, @Param('imgId') imgId: string) {
    const product = this.store.products.find((p) => p.id === id);
    if (!product) return { message: 'Not found' };
    product.images = product.images.map((img) => ({
      ...img,
      isPrimary: img.id === imgId,
    }));
    return { success: true };
  }
}
