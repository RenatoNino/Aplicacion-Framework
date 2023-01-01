import { Module } from '@nestjs/common';
import { VentaService } from './venta.service';
import { VentaController } from './venta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalleVenta.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Venta,DetalleVenta]),
  ],
  controllers: [VentaController],
  providers: [VentaService]
})
export class VentaModule {}
