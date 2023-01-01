import { IsNotEmpty, IsNumber, Length } from "class-validator";

export class CreateClienteDto {
    @Length(8)
    dni:string;

    @IsNotEmpty()
    nombres: string;

    @IsNotEmpty()
    apellidos: string;

    @IsNumber({maxDecimalPlaces:0})
    edad: number;

    @IsNumber({maxDecimalPlaces:2})
    talla: number;
}
