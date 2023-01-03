import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClienteModule } from './cliente/cliente.module';
import { Cliente } from './cliente/entities/cliente.entity';
import { Producto } from './producto/entities/producto.entity';
import { ProductoModule } from './producto/producto.module';
import { DetalleVenta } from './venta/entities/detalleVenta.entity';
import { Venta } from './venta/entities/venta.entity';
import { VentaModule } from './venta/venta.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'renato123',
        database: 'monografia_nestjs',
        entities: [Cliente, Producto, Venta,DetalleVenta],
        synchronize: false,
        autoLoadEntities: true,
      }),
    }),
    ClienteModule, ProductoModule, VentaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
