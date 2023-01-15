import { Cliente } from "src/cliente/entities/cliente.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DetalleVenta } from "./detalleVenta.entity";

@Entity('Venta')
export class Venta {
    @PrimaryGeneratedColumn('increment')
    id:number;

    @CreateDateColumn({type:'timestamp'})
    fecha:Date;

    @Column({type:'decimal',precision:8,scale:2})
    monto:number;

    @OneToMany(() => DetalleVenta,(detallesVenta) => detallesVenta.venta)
    @JoinColumn()
    detallesVenta: DetalleVenta[]

    @ManyToOne(()=>Cliente,(cliente)=>cliente.ventas)
    @JoinColumn()
    cliente:Cliente
}
