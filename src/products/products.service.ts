import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDTO } from '../common/dtos/pagination.dto';
import { Product, ProductImage } from './entities';
import { User } from './../auth/entities/user.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger( 'ProductsService' );


  constructor(
    @InjectRepository( Product )
    private readonly productRepository: Repository<Product>,

    @InjectRepository( ProductImage )
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) { }


  async create( createProductDto: CreateProductDto, user: User ) {

    try {
      const { images = [], ...productDetails } = createProductDto;
      const newProduct = this.productRepository.create( {
        ...productDetails,
        images: images.map( image =>
          this.productImageRepository.create( { url: image } )
        ),
        user: user
      } );

      await this.productRepository.save( newProduct );

      return { ...newProduct, images };

    } catch ( error ) {
      this.handleDBExceptions( error );
    }
  }

  async findAll( paginationDTO: PaginationDTO ) {

    const { limit = 10, offset = 0 } = paginationDTO;

    const allProducts = await this.productRepository.find( {
      take: limit,
      skip: offset,
      relations: {
        images: true,
      }
    } );

    if ( allProducts.length < 1 ) {
      throw new NotFoundException( `Products not found` );
    }

    return allProducts.map( ( { images, ...restProduct } ) => (
      {
        ...restProduct,
        images: images.map( img => img.url )
      }
    ) );
  }

  async findOne( term: string ) {

    let product: Product;

    if ( isUUID( term ) ) {
      product = await this.productRepository.findOneBy( { id: term } );
    } else {

      const queryBuilder = this.productRepository.createQueryBuilder( 'prod' );

      product = await queryBuilder
        .where( `UPPER(title) =:title or slug =:slug`, {
          title: term.toUpperCase(),
          slug: term.toLowerCase()
        } )
        .leftJoinAndSelect( 'prod.images', 'prodImages' )
        .getOne();
    }

    if ( !product ) {
      throw new NotFoundException( `Product with "${ term }" not found` );
    }

    return product;
  }

  async update( id: string, updateProductDto: UpdateProductDto, user: User ) {

    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload( {
      id,
      ...toUpdate
    } );

    if ( !product ) {
      throw new NotFoundException( `Product with id "${ id }" not found` );
    }

    // Create Query Runner - transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if ( images ) {
        await queryRunner.manager.delete( ProductImage, { product: { id } } );

        product.images = images.map( image => this.productImageRepository.create( { url: image } ) );
      }

      product.user = user;

      await queryRunner.manager.save( product );
      await queryRunner.commitTransaction();
      await queryRunner.release();

      // return product;
      return this.findOnePlain( id );
    } catch ( error ) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDBExceptions( error );
    }
  }

  async remove( id: string ) {
    const product = await this.findOne( id );

    if ( !product ) {
      throw new NotFoundException( `Product with id "${ id }" not found` );
    }

    await this.productRepository.remove( product );
    return `product with id "${ id }" successfully removed`;
  }

  async findOnePlain( term: string ) {
    const { images = [], ...product } = await this.findOne( term );
    return {
      ...product,
      images: images.map( img => img.url )
    };
  }

  private handleDBExceptions( error: any ) {
    if ( error.code === '23505' ) {
      throw new BadRequestException( error.detail );
    }
    this.logger.error( error );
    throw new InternalServerErrorException( 'Unexpected error, check server logs' );
  }

  async removeAll() {
    const query = this.productRepository.createQueryBuilder( 'product' );

    try {
      return await query
        .delete()
        .where( {} )
        .execute();
    } catch ( error ) {
      this.handleDBExceptions( error );
    }
  }
}
