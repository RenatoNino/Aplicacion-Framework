import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateProductoDto {
    @IsNotEmpty()
    nombre:string;

    @IsNumber({maxDecimalPlaces:2})
    precio:number;

    @IsNumber({maxDecimalPlaces:1})
    stock:number;
}
