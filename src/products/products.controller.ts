import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDTO } from '../common/dtos/pagination.dto';
import { User } from './../auth/entities/user.entity';
import { Auth, GetUser } from './../auth/decorators';
import { ValidRoles } from './../auth/interfaces';
import { Product } from './entities';

@ApiTags( 'Products' )
@Controller( 'products' )
// @Auth()
export class ProductsController {
    constructor( private readonly productsService: ProductsService ) { }

    @Post()
    @Auth( ValidRoles.user )
    @ApiResponse( { status: 201, description: "Product was created", type: Product } )
    @ApiResponse( { status: 400, description: "Bad Request" } )
    @ApiResponse( { status: 403, description: "Forbidden. Toked related" } )
    create(
        @Body() createProductDto: CreateProductDto,
        @GetUser() user: User
    ) {
        return this.productsService.create( createProductDto, user );
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
    update(
        @Param( 'id', ParseUUIDPipe ) id: string,
        @Body() updateProductDto: UpdateProductDto,
        @GetUser() user: User
    ) {
        return this.productsService.update( id, updateProductDto, user );
    }

    @Delete( ':id' )
    @Auth( ValidRoles.admin )
    remove( @Param( 'id', ParseUUIDPipe ) id: string ) {
        return this.productsService.remove( id );
    }
}
