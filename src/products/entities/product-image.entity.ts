import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductImage {

    @PrimaryGeneratedColumn('increment')
    id: number;


    @Column('text')
    url: string;

}