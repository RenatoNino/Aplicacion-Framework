import { DetalleVenta } from "src/venta/entities/detalleVenta.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Producto')
export class Producto {
    @PrimaryGeneratedColumn('increment')
    id:number;

    @Column({type:'varchar',length:50})
    nombre:string;

    @Column({type:'decimal'})
    precio:number;

    @Column({type:'int'})
    stock:number;

    @OneToMany(() => DetalleVenta, (detallesVenta) => detallesVenta.producto)
    detallesVenta: DetalleVenta[];
}   
