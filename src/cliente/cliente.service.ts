import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Venta } from 'src/venta/entities/venta.entity';
import { Repository } from 'typeorm';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private clientesRepository: Repository<Cliente>,
    @InjectRepository(Venta)
    private ventasRepository: Repository<Venta>
  ) { }

  async create(createClienteDto: CreateClienteDto) {
    const expRegDNI = /^\d*$/g;
    if (!expRegDNI.test(createClienteDto.dni)) {
      throw new HttpException('El número DNI es inválido.', HttpStatus.BAD_REQUEST,);
    }

    const clienteExiste = await this.clientesRepository.findOneBy({dni:createClienteDto.dni});
    if(clienteExiste){
      throw new HttpException(`El cliente con dni:${createClienteDto.dni} ya existe.`,HttpStatus.BAD_REQUEST); 
    }

    const cliente = await this.clientesRepository.create(createClienteDto);
    return await this.clientesRepository.save(cliente);
  }

  async findAll() {
    const clientes = await this.clientesRepository.find(); 
    return clientes;
  }

  async findOne(dni: string) {
    const cliente = await this.clientesRepository.findOneBy({dni});
    if(!cliente){
      throw new HttpException(`El cliente con dni:${dni} no existe.`,HttpStatus.NOT_FOUND);
    }
    return cliente;
  }

  async update(dni: string, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.clientesRepository.findOneBy({dni});
    if(!cliente){
      throw new HttpException(`El cliente con dni:${dni} no existe.`,HttpStatus.NOT_FOUND);
    }

    await this.clientesRepository.update({dni},updateClienteDto);
    return await this.clientesRepository.findOneBy({dni});
  }

  async remove(dni: string) {
    const cliente = await this.clientesRepository.findOneBy({dni});
    if(!cliente){
      throw new HttpException(`El cliente con dni:${dni} no existe.`,HttpStatus.NOT_FOUND);
    }

    const {id} = cliente;
    const venta = await this.ventasRepository.findOneBy({cliente})
    if(venta){
      throw new HttpException(`El cliente con dni:${cliente.dni} no se puede eliminar porque tiene asociada una venta.`,HttpStatus.BAD_REQUEST)  
    }

    await this.clientesRepository.delete({id})
    return '¡Eliminación exitosa!';
  }
}
