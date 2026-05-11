import {
  BadGatewayException,
  BadRequestException,
  InternalServerErrorException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductsService {
  private static cloudinaryConfigured = false;

  constructor(private readonly prisma: PrismaService) {
    if (ProductsService.cloudinaryConfigured) {
      return;
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new InternalServerErrorException(
        'Cloudinary configuration is missing',
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    ProductsService.cloudinaryConfigured = true;
  }

  list(category?: string, purity?: string) {
    return this.prisma.product.findMany({
      where: {
        ...(category ? { categoryId: category } : {}),
        ...(purity ? { purity } : {}),
      },
      include: { images: true, category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true, category: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...dto,
        isActive: dto.isActive ?? true,
        isFeatured: dto.isFeatured ?? false,
      },
      include: { images: true, category: true },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.getById(id);

    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: { images: true, category: true },
    });
  }

  async remove(id: string) {
    await this.getById(id);
    await this.prisma.product.delete({ where: { id } });
    return { success: true };
  }

  async uploadImage(productId: string, file: Express.Multer.File) {
    await this.getById(productId);

    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'swarnashop/products',
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) {
            reject(
              error instanceof Error
                ? error
                : new Error('Cloudinary upload failed'),
            );
            return;
          }
          resolve(result);
        },
      );

      uploadStream.end(file.buffer);
    });

    const currentImages = await this.prisma.productImage.count({
      where: { productId },
    });

    return this.prisma.productImage.create({
      data: {
        productId,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        isPrimary: currentImages === 0,
      },
    });
  }

  async deleteImage(productId: string, publicId: string) {
    const decodedPublicId = decodeURIComponent(publicId);

    const image = await this.prisma.productImage.findFirst({
      where: { productId, publicId: decodedPublicId },
    });

    if (!image) {
      throw new NotFoundException('Product image not found');
    }

    const deleteResult = (await cloudinary.uploader.destroy(decodedPublicId, {
      resource_type: 'image',
    })) as { result?: string };

    if (deleteResult.result !== 'ok' && deleteResult.result !== 'not found') {
      throw new BadGatewayException('Failed to delete image from Cloudinary');
    }

    await this.prisma.productImage.delete({ where: { id: image.id } });

    return { success: true };
  }
}
