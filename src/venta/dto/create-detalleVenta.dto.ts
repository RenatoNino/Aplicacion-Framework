import { Producto } from "src/producto/entities/producto.entity";
import { Venta } from "../entities/venta.entity";

export class CreateDetalleVentaDto{
    subtotal:number;
    cantidad:number;
    producto:Producto;
    venta:Venta
}