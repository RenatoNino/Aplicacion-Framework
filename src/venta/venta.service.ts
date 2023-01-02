import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Producto } from 'src/producto/entities/producto.entity';
import { Repository } from 'typeorm';
import { CreateDetalleVentaDto } from './dto/create-detalleVenta.dto';
import { CreateVentaDto } from './dto/create-venta.dto';
import { DatosVentaDto } from './dto/datosVenta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { DetalleVenta } from './entities/detalleVenta.entity';
import { Venta } from './entities/venta.entity';

@Injectable()
export class VentaService {
  constructor(
    @InjectRepository(Venta)
    private ventasRepository:Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private detalleVentasRepository:Repository<DetalleVenta>,
    @InjectRepository(Producto)
    private productosRepository:Repository<Producto>,
    @InjectRepository(Cliente)
    private clientesRepository:Repository<Cliente>
  ){}

  async create(datosVentaDto: DatosVentaDto) {
    const {productos,dniCliente} = datosVentaDto;
    //Valido los datos enviados
    const cliente = await this.clientesRepository.findOneBy({dni:dniCliente});
    if(!cliente){
      throw new HttpException(`El cliente con dni ${dniCliente} no existe.`,HttpStatus.NOT_FOUND);
    }
    for(var i=0;i<productos.length;i++){
      const producto = await this.productosRepository.findOneBy({id:productos[i].id});
      if(!producto){
        throw new HttpException(`El producto con id ${productos[i].id} no existe,`,HttpStatus.NOT_ACCEPTABLE);
      } 
      if(producto.stock<productos[i].cantidad){
        throw new HttpException(`El producto con id ${producto.id} solo tiene un stock de ${producto.stock} unidades.`,HttpStatus.CONFLICT);
      }
    }

    //Registro la venta vacía
    const createVenta:CreateVentaDto = {
      detallesVenta:null,
      monto:0
    }
    const venta = await this.ventasRepository.create(createVenta);
    await this.ventasRepository.save(venta);

    //Registro los Detalles de Venta
    var monto=0;
    for(var i=0;i<productos.length;i++){
      const producto = await this.productosRepository.findOneBy({id:productos[i].id});
      const createDetalleVenta:CreateDetalleVentaDto = {
        cantidad:productos[i].cantidad,
        producto:producto,
        subtotal: productos[i].cantidad*producto.precio,
        venta
      }
      await this.detalleVentasRepository.save(createDetalleVenta);
      await this.productosRepository.update({id:producto.id},{stock:producto.stock-createDetalleVenta.cantidad})
      monto+=createDetalleVenta.subtotal;
    }
    await this.ventasRepository.update({id:venta.id},{monto});

    return await this.ventasRepository.findOneBy({id:venta.id});
  }

  async findAll() {
    return `This action returns all venta`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} venta`;
  }

  async update(id: number, updateVentaDto: UpdateVentaDto) {
    return `This action updates a #${id} venta`;
  }

  async remove(id: number) {
    return `This action removes a #${id} venta`;
  }
}
