import { DetalleVenta } from "../entities/detalleVenta.entity";

export class CreateVentaDto {
    monto:number;
    detallesVenta:DetalleVenta[];
}
