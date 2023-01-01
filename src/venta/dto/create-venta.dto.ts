import { ArrayNotEmpty } from "class-validator";
import { Producto } from "src/producto/entities/producto.entity";

export class CreateVentaDto {
    @ArrayNotEmpty()
    productos: Producto[];
}
