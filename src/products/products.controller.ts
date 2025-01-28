import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDTO } from '../common/dtos/pagination.dto';
import { Auth } from './../auth/decorators';
import { ValidRoles } from './../auth/interfaces';

@Controller( 'products' )
// @Auth()
export class ProductsController {
  constructor( private readonly productsService: ProductsService ) { }

  @Post()
  @Auth( ValidRoles.user )
  create( @Body() createProductDto: CreateProductDto ) {
    return this.productsService.create( createProductDto );
  }

  @Get()
  findAll( @Query() paginationDTO: PaginationDTO ) {
    return this.productsService.findAll( paginationDTO );
  }

  @Get( ':term' )
  findOne( @Param( 'term' ) term: string ) {
    return this.productsService.findOnePlain( term );
  }

  @Patch( ':id' )
  @Auth( ValidRoles.admin )
  update( @Param( 'id', ParseUUIDPipe ) id: string, @Body() updateProductDto: UpdateProductDto ) {
    return this.productsService.update( id, updateProductDto );
  }

  @Delete( ':id' )
  @Auth( ValidRoles.admin )
  remove( @Param( 'id', ParseUUIDPipe ) id: string ) {
    return this.productsService.remove( id );
  }
}
