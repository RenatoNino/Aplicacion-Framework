import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClienteModule } from './cliente/cliente.module';
import { ProductoModule } from './producto/producto.module';
import { VentaModule } from './venta/venta.module';

@Module({
  imports: [ClienteModule, ProductoModule, VentaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
