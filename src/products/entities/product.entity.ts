import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./";

@Entity({ name: 'products' })
export class Product {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    // @Column({
    //     type: 'text',
    //     unique: true
    // })

    @Column('text', {
        unique: true
    })
    title: string;


    @Column('float', {
        default: 0
    })
    price: number

    @Column('text', {
        nullable: true
    })
    description: string

    @Column('text', {
        unique: true
    })
    slug: string

    @Column('int', {
        default: 0
    })
    stock: number

    @Column('text', {
        array: true
    })
    sizes: string[]

    @Column('text',)
    gender: string

    // tags
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]

    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        {
            cascade: true,
            eager: true
        }
    )
    images?: ProductImage[]

    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title
        }

        this.slug = this.slug.toLowerCase()
            .replaceAll(" ", "_")
            .replaceAll("'", "")
    }

    @BeforeUpdate()
    checkSlugUpdateBeforeUpdate() {
        this.slug = this.slug.toLowerCase()
            .replaceAll(" ", "_")
            .replaceAll("'", "")
    }
}
