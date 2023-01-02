import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DetalleVenta } from 'src/venta/entities/detalleVenta.entity';
import { Repository } from 'typeorm';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository:Repository<Producto>,
    @InjectRepository(DetalleVenta)
    private detalleVentasRepository: Repository<DetalleVenta>
  ){}

  async create(createProductoDto: CreateProductoDto) {
    const productoExiste = await this.productosRepository.findOneBy({nombre:createProductoDto.nombre})
    if(productoExiste){
      throw new HttpException(`Ya existe un producto con el nombre ${createProductoDto.nombre}.`,HttpStatus.AMBIGUOUS)
    }
    
    const producto = await this.productosRepository.create(createProductoDto);
    return await this.productosRepository.save(producto);
  }

  async findAll() {
    const productos = await this.productosRepository.find(); 
    return productos;
  }

  async findOne(id: number) {
    const producto = await this.productosRepository.findOneBy({id});
    if(!producto){
      throw new HttpException(`El producto con id ${id} no existe.`,HttpStatus.NOT_FOUND);
    }
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    const producto = await this.productosRepository.findOneBy({id});
    if(!producto){
      throw new HttpException(`El producto con id ${id} no existe.`,HttpStatus.NOT_FOUND);
    }
    
    const productoExiste = await this.productosRepository.findOneBy({nombre:updateProductoDto.nombre})
    if(productoExiste){
      throw new HttpException(`Ya existe un producto con el nombre ${updateProductoDto.nombre}.`,HttpStatus.AMBIGUOUS)
    }

    await this.productosRepository.update({id},updateProductoDto);
    return await this.productosRepository.findOneBy({id});
  }

  async remove(id: number) {
    const producto = await this.productosRepository.findOneBy({id});
    if(!producto){
      throw new HttpException(`El producto con id ${id} no existe.`,HttpStatus.NOT_FOUND);
    }

    const ventaExiste = await this.detalleVentasRepository.findOneBy({producto});
    if(ventaExiste){
      throw new HttpException(`El producto con id ${id} no se puede eliminar porque está asociado a una venta.`,HttpStatus.CONFLICT);
    }

    await this.productosRepository.delete({id});
    return '¡Eliminación exitosa!';
  }
}
