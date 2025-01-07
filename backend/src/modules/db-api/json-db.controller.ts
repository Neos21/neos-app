import { Body, Controller, HttpStatus, ParseIntPipe, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { ValidatorService } from './validator.service';
import { JsonDbService } from './json-db.service';

@Controller('db-api/json-db')
export class JsonDbController {
  constructor(
    private readonly validatorService: ValidatorService,
    private readonly jsonDbService: JsonDbService
  ) { }
  
  @Post('list-db-names')
  public listDbNames(@Body('credential') credential: string, @Res() response: Response): Response<{ db_names: Array<string> }> {
    try {
      if(!this.validateCredential(credential, response)) return;
      
      const dbNames = this.jsonDbService.listDbNames();
      return response.status(HttpStatus.OK).json({ db_names: dbNames });
    }
    catch(error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: `Failed To List DB Names : ${error.toString()}` });
    }
  }
  
  @Post('create-db')
  public async createDb(@Body('credential') credential: string, @Body('db_name') dbName: string, @Body('db_credential') dbCredential: string, @Res() response: Response): Promise<Response<{ result: string }>> {
    try {
      if(!this.validateCredential(credential, response)) return;
      const validateResult = this.validatorService.validateDbInput(dbName, dbCredential);
      if(validateResult) return response.status(HttpStatus.BAD_REQUEST).json({ error: validateResult });
      if(this.jsonDbService.existsDbName(dbName)) return response.status(HttpStatus.BAD_REQUEST).json({ error: 'The Name Of DB Already Exists' });
    
      await this.jsonDbService.createDb(dbName, dbCredential);
      return response.status(HttpStatus.CREATED).json({ result: 'Created' });
    }
    catch(error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: `Failed To Create DB : ${error.toString()}` });
    }
  }
  
  @Post('delete-db')
  public async deleteDb(@Body('credential') credential: string, @Body('db_name') dbName: string, @Body('db_credential') dbCredential: string, @Res() response: Response): Promise<Response<{ result: string }>> {
    try {
      if(!this.validateCredential(credential, response)) return;
      if(!this.validateDb(dbName, dbCredential, response)) return;
      
      await this.jsonDbService.deleteDb(dbName, dbCredential);
      return response.status(HttpStatus.NO_CONTENT).json({ result: 'Deleted' });
    }
    catch(error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: `Failed To Delete DB : ${error.toString()}` });
    }
  }
  
  @Post('find-all')
  public async findAll(@Body('db_name') dbName: string, @Body('db_credential') dbCredential: string, @Res() response: Response): Promise<Response<{ results: Array<any> }>> {
    try {
      if(!this.validateDb(dbName, dbCredential, response)) return;
      
      const results = await this.jsonDbService.findAll(dbName);
      return response.status(HttpStatus.OK).json({ results });
    }
    catch(error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: `Failed To Find All : ${error.toString()}` });
    }
  }
  
  @Post('find-by-id')
  public async findById(@Body('db_name') dbName: string, @Body('db_credential') dbCredential: string, @Body('id', ParseIntPipe) id: number, @Res() response: Response): Promise<Response<{ result: any }>> {
    try {
      if(!this.validateDb(dbName, dbCredential, response)) return;
      
      const result = await this.jsonDbService.findById(dbName, id);
      return response.status(HttpStatus.OK).json({ result });
    }
    catch(error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: `Failed To Find By ID : ${error.toString()}` });
    }
  }
  
  @Post('create')
  public async create(@Body('db_name') dbName: string, @Body('db_credential') dbCredential: string, @Body('item') item: any, @Res() response: Response): Promise<Response<{ result: any }>> {
    try {
      if(!this.validateDb(dbName, dbCredential, response)) return;
      if(!this.validatorService.isObject(item)) return response.status(HttpStatus.BAD_REQUEST).json({ error: 'The Item Is Not A Object' });
      
      const result = await this.jsonDbService.create(dbName, item);
      return response.status(HttpStatus.OK).json({ result });
    }
    catch(error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: `Failed To Create : ${error.toString()}` });
    }
  }
  
  @Post('put-by-id')
  public async putById(@Body('db_name') dbName: string, @Body('db_credential') dbCredential: string, @Body('id', ParseIntPipe) id: number, @Body('item') item: any, @Res() response: Response): Promise<Response<{ result: any }>> {
    try {
      if(!this.validateDb(dbName, dbCredential, response)) return;
      if(!this.validatorService.isObject(item)) return response.status(HttpStatus.BAD_REQUEST).json({ error: 'The Item Is Not A Object' });
      
      const result = await this.jsonDbService.putById(dbName, id, item);
      if(result == null) return response.status(HttpStatus.BAD_REQUEST).json({ error: 'The Item Not Found (Invalid ID)' });
      return response.status(HttpStatus.OK).json({ result });
    }
    catch(error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: `Failed To Put By ID : ${error.toString()}` });
    }
  }
  
  @Post('patch-by-id')
  public async patchById(@Body('db_name') dbName: string, @Body('db_credential') dbCredential: string, @Body('id', ParseIntPipe) id: number, @Body('item') item: any, @Res() response: Response): Promise<Response<{ result: any }>> {
    try {
      if(!this.validateDb(dbName, dbCredential, response)) return;
      if(!this.validatorService.isObject(item)) return response.status(HttpStatus.BAD_REQUEST).json({ error: 'The Item Is Not A Object' });
      
      const result = await this.jsonDbService.patchById(dbName, id, item);
      if(result == null) return response.status(HttpStatus.BAD_REQUEST).json({ error: 'The Item Not Found (Invalid ID)' });
      return response.status(HttpStatus.OK).json({ result });
    }
    catch(error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: `Failed To Patch By ID : ${error.toString()}` });
    }
  }
  
  @Post('delete-by-id')
  public async deleteById(@Body('db_name') dbName: string, @Body('db_credential') dbCredential: string, @Body('id', ParseIntPipe) id: number, @Res() response: Response): Promise<Response<{ result: any }>> {
    try {
      if(!this.validateDb(dbName, dbCredential, response)) return;
      
      const result = await this.jsonDbService.deleteById(dbName, id);
      if(result == null) return response.status(HttpStatus.BAD_REQUEST).json({ error: 'The Item Not Found (Invalid ID)' });
      return response.status(HttpStatus.OK).json({ result });  // No Content 204 だと JSON がレスポンスされないため OK にしておく
    }
    catch(error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: `Failed To Delete By ID : ${error.toString()}` });
    }
  }
  
  private validateCredential(credential: string, response: Response): boolean {
    if(!this.validatorService.validateCredential(credential)) {
      response.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid Credential' });
      return false;
    }
    return true;
  }
  
  private validateDb(dbName: string, dbCredential: string, response: Response): boolean {
    const validateResult = this.validatorService.validateDbInput(dbName, dbCredential);
    if(validateResult) {
      response.status(HttpStatus.BAD_REQUEST).json({ error: validateResult });
      return false;
    }
    
    if(!this.jsonDbService.existsDb(dbName, dbCredential)) {
      response.status(HttpStatus.BAD_REQUEST).json({ error: 'The DB Does Not Exist' });
      return false;
    }
    
    return true;
  }
}
