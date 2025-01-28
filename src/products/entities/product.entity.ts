import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';
import { ProductImage } from "./";
import { User } from '../../auth/entities/user.entity';

@Entity( { name: 'products' } )
export class Product {

    @ApiProperty( {
        example: '649a858d-8351-447d-abc8-000a3f860a4a',
        description: "Product ID",
        uniqueItems: true
    } )
    @PrimaryGeneratedColumn( "uuid" )
    id: string;

    // @Column({
    //     type: 'text',
    //     unique: true
    // })

    @ApiProperty( {
        example: "Pingun's shirt Tp",
        description: "Product Title",
        uniqueItems: true
    } )
    @Column( 'text', {
        unique: true
    } )
    title: string;

    @ApiProperty( {
        example: 0,
        description: "Product Price",
    } )
    @Column( 'float', {
        default: 0
    } )
    price: number;

    @ApiProperty(
        {
            example: 'In commodo ullamco cillum laborum pariatur commodo sint voluptate id veniam.',
            description: "Product Description",
            default: null
        }
    )
    @Column( 'text', {
        nullable: true
    } )
    description: string;

    @ApiProperty(
        {
            example: "pinguns_shirt_tp",
            description: "Product Slug - for SEO",
            uniqueItems: true,
        }
    )
    @Column( 'text', {
        unique: true
    } )
    slug: string;

    @ApiProperty(
        {
            example: 10,
            description: "Product Stock",
            default: 0
        }
    )
    @Column( 'int', {
        default: 0
    } )
    stock: number;

    @ApiProperty(
        {
            example: [
                "SM",
                "M",
                "L"
            ],
            description: "Product Sizes",
        }
    )
    @Column( 'text', {
        array: true
    } )
    sizes: string[];

    @ApiProperty( {
        example: "men",
        description: "Product Gender",
    } )
    @Column( 'text', )
    gender: string;

    // tags
    @ApiProperty()
    @Column( 'text', {
        array: true,
        default: []
    } )
    tags: string[];

    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        ( productImage ) => productImage.product,
        {
            cascade: true,
            eager: true
        }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        ( user ) => user.product,
        { eager: true }
    )
    user: User;

    @BeforeInsert()
    checkSlugInsert() {
        if ( !this.slug ) {
            this.slug = this.title;
        }

        this.slug = this.slug.toLowerCase()
            .replaceAll( " ", "_" )
            .replaceAll( "'", "" );
    }

    @BeforeUpdate()
    checkSlugUpdateBeforeUpdate() {
        this.slug = this.slug.toLowerCase()
            .replaceAll( " ", "_" )
            .replaceAll( "'", "" );
    }
}
