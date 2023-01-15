import { Cliente } from "src/cliente/entities/cliente.entity";
import { DetalleVenta } from "../entities/detalleVenta.entity";

export class CreateVentaDto {
    monto:number;
    detallesVenta:DetalleVenta[];
    cliente:Cliente;
}
