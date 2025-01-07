import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { ValidatorService } from './validator.service';
import { SqliteService } from './sqlite.service';

@Controller('db-api/sqlite')
export class SqliteController {
  constructor(
    private readonly validatorService: ValidatorService,
    private readonly sqliteService: SqliteService
  ) { }
  
  @Post('list-db-names')
  public async listDbNames(@Body('credential') credential: string, @Res() response: Response): Promise<Response<{ db_names: Array<string> }>> {
    try {
      if(!this.validateCredential(credential, response)) return;
      
      const dbNames = await this.sqliteService.listDbNames();
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
      if(await this.sqliteService.existsDbName(dbName)) return response.status(HttpStatus.BAD_REQUEST).json({ error: 'The Name Of DB Already Exists' });
    
      await this.sqliteService.createDb(dbName, dbCredential);
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
      if(! await this.validateDb(dbName, dbCredential, response)) return;
      
      await this.sqliteService.deleteDb(dbName, dbCredential);
      return response.status(HttpStatus.NO_CONTENT).json({ result: 'Deleted' });
    }
    catch(error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: `Failed To Delete DB : ${error.toString()}` });
    }
  }
  
  @Post('run')
  public async run(@Body('db_name') dbName: string, @Body('db_credential') dbCredential: string, @Body('sql') sql: string, @Body('params') params: Array<any> | any, @Res() response: Response): Promise<Response<{ result: any }>> {
    try {
      if(!this.validateDb(dbName, dbCredential, response)) return;
      if(this.validatorService.isEmpty(sql)) return response.status(HttpStatus.BAD_REQUEST).json({ error: 'The SQL Is Empty' });
      
      const result = await this.sqliteService.run(dbName, sql, params);
      return response.status(HttpStatus.OK).json({ result: result ?? null });
    }
    catch(error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: `Failed To Run : ${error.toString()}` });
    }
  }
  
  @Post('get')
  public async get(@Body('db_name') dbName: string, @Body('db_credential') dbCredential: string, @Body('sql') sql: string, @Body('params') params: Array<any> | any, @Res() response: Response): Promise<Response<{ result: any }>> {
    try {
      if(!this.validateDb(dbName, dbCredential, response)) return;
      if(this.validatorService.isEmpty(sql)) return response.status(HttpStatus.BAD_REQUEST).json({ error: 'The SQL Is Empty' });
      
      const result = await this.sqliteService.get(dbName, sql, params);
      return response.status(HttpStatus.OK).json({ result: result ?? null });
    }
    catch(error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: `Failed To Get : ${error.toString()}` });
    }
  }
  
  @Post('all')
  public async all(@Body('db_name') dbName: string, @Body('db_credential') dbCredential: string, @Body('sql') sql: string, @Body('params') params: Array<any> | any, @Res() response: Response): Promise<Response<{ results: Array<any> }>> {
    try {
      if(!this.validateDb(dbName, dbCredential, response)) return;
      if(this.validatorService.isEmpty(sql)) return response.status(HttpStatus.BAD_REQUEST).json({ error: 'The SQL Is Empty' });
      
      const results = await this.sqliteService.all(dbName, sql, params);
      return response.status(HttpStatus.OK).json({ results: results ?? null });
    }
    catch(error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: `Failed To Get : ${error.toString()}` });
    }
  }
  
  private validateCredential(credential: string, response: Response): boolean {
    if(!this.validatorService.validateCredential(credential)) {
      response.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid Credential' });
      return false;
    }
    return true;
  }
  
  private async validateDb(dbName: string, dbCredential: string, response: Response): Promise<boolean> {
    const validateResult = this.validatorService.validateDbInput(dbName, dbCredential);
    if(validateResult) {
      response.status(HttpStatus.BAD_REQUEST).json({ error: validateResult });
      return false;
    }
    
    if(! await this.sqliteService.existsDb(dbName, dbCredential)) {
      response.status(HttpStatus.BAD_REQUEST).json({ error: 'The DB Does Not Exist' });
      return false;
    }
    
    return true;
  }
}
