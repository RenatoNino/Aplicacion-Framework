import { Venta } from "src/venta/entities/venta.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Cliente')
export class Cliente {
    @PrimaryGeneratedColumn('increment')
    id:number;

    @Column({type:'char',length:8})
    dni:string;

    @Column({type:'varchar',length:50})
    nombres:string;

    @Column({type:'varchar',length:50})
    apellidos: string;

    @CreateDateColumn({type:'timestamp'})
    fechaRegistro:Date;

    @Column({type:'int'})
    edad:number;

    @Column({type:'decimal',precision:3,scale:2})
    talla:number;

    @OneToMany(()=>Venta,(ventas)=>ventas.cliente)
    ventas:Venta[]
}
