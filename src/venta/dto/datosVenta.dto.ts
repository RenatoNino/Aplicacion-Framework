import { ArrayNotEmpty, Length } from "class-validator";
import { datosProductoVendido } from "src/types/type";

export class DatosVentaDto{
    @Length(8)
    dniCliente: string;

    @ArrayNotEmpty()
    productos: datosProductoVendido[];
}