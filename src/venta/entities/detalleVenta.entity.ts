import { Producto } from "src/producto/entities/producto.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Venta } from "./venta.entity";

@Entity('DetalleVenta')
export class DetalleVenta{
    @PrimaryGeneratedColumn('increment')
    id:number;

    @Column({type:'decimal',precision:8,scale:2})
    subtotal:number;
    
    @Column({type:'int'})
    cantidad:number;

    @ManyToOne(() => Producto, (producto) => producto.detallesVenta)
    @JoinColumn()
    producto:Producto

    @ManyToOne(() => Venta,(venta) => venta.detallesVenta)
    @JoinColumn()
    venta:Venta;
}