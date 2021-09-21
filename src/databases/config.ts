import { thisTypeAnnotation } from "@babel/types";
import Dexie, { IndexableType } from "dexie";


export interface IConfig{
    id? : number;
    name : string;
    value : string;

}


export class Config extends Dexie {
    
    //TODOS: need to be optimized
    configs : Dexie.Table<IConfig,number>;

    
    constructor() { 
        super('db_config');
        
        this.version(1).stores({
            configs: '++id,name,value',

        });

        this.configs = this.table("configs");

    }
}





