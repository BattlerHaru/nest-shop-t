import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
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


    @Column('numeric', {
        default: 0
    })
    price: number

    @Column('text', {
        nullable: true
    })
    description: string

    @Column('text', {
        nullable: true
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

    //images
}