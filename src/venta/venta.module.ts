import { Module } from '@nestjs/common';
import { VentaService } from './venta.service';
import { VentaController } from './venta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalleVenta.entity';
import { Producto } from 'src/producto/entities/producto.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Venta,DetalleVenta,Producto,Cliente]),
  ],
  controllers: [VentaController],
  providers: [VentaService]
})
export class VentaModule {}
