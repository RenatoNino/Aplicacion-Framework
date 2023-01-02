import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { DetalleVenta } from 'src/venta/entities/detalleVenta.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Producto,DetalleVenta]),
  ],
  controllers: [ProductoController],
  providers: [ProductoService]
})
export class ProductoModule {}
