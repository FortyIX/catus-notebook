import { thisTypeAnnotation } from "@babel/types";
import Dexie, { IndexableType } from "dexie";


export interface INote{
    id? : number;
    content : string;
    date : number;
    tag:string;
    notebook:string;
    isdone : number;
}

export interface INotebooks{
    id?:number;
    notebook:string;
}

export interface ITags{
    id?:number;
    tag:string;
}

export class Database extends Dexie {
    
    //TODOS: need to be optimized
    notes : Dexie.Table<INote,number>;
    notebooks : Dexie.Table<INotebooks,number>;
    tags:Dexie.Table<ITags,number>;
    
    constructor() { 
        super('db_note');
        
        this.version(1).stores({
            notes: '++id,content,tag,notebook,date,isdone',
            notebooks: '++id, notebook',
            tags:'++id,tag',
        });

        this.notes = this.table("notes");
        this.notebooks = this.table("notebooks");
        this.tags = this.table('tags')

    }
}





