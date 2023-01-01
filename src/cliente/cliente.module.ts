import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Venta } from 'src/venta/entities/venta.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Cliente,Venta]),
  ],
  controllers: [
    ClienteController],
  providers: [ClienteService]
})
export class ClienteModule {}
