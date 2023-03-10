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
      monto:0,
      cliente
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
    const ventas = await this.ventasRepository
      .createQueryBuilder("Venta")
      .innerJoin("Venta.cliente","Cliente")
      .select("Venta.id","id")
      .addSelect("Venta.fecha","fecha")
      .addSelect("Venta.monto","monto")
      .addSelect("Cliente.dni","dniCliente")
      .getRawMany();

    return ventas;
  }

  async findOne(id: number) {
    const venta = await this.ventasRepository.findOneBy({id});
    if(!venta){
      throw new HttpException(`La venta con id ${id} no existe.`,HttpStatus.NOT_FOUND);
    }
    return venta;
  }

  async update(id: number, updateVentaDto: UpdateVentaDto) {
    return `This action updates a #${id} venta`;
  }

  async remove(id: number) {
    const venta = await this.ventasRepository.findOneBy({id});
    console.log(venta);
    if(!venta){
      throw new HttpException(`La venta con id ${id} no existe.`,HttpStatus.NOT_FOUND);
    }

    const detallesVenta = await this.detalleVentasRepository
      .createQueryBuilder("DetalleVenta")
      .innerJoinAndSelect("DetalleVenta.venta","Venta")
      .innerJoinAndSelect("DetalleVenta.producto","Producto")
      .where("Venta.id = :venta.id")
      .setParameter("venta.id",venta.id)
      .getMany();
    
    for(var i=0;i<detallesVenta.length;i++){
      const {producto} = detallesVenta[i];
      await this.productosRepository.update({id:producto.id},{stock:producto.stock+detallesVenta[i].cantidad});
      await this.detalleVentasRepository.delete({id:detallesVenta[i].id});
    }

    await this.ventasRepository.delete({id})
    return '¡Elimminación Exitosa!';
  }
}
