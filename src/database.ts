import { thisTypeAnnotation } from "@babel/types";
import Dexie, { IndexableType } from "dexie";


export interface INote{
    id? : number;
    content : string;
    tag : string;
    notebook : string;
    date : number;
    isdone : number;
}

export class Database extends Dexie {
    
    //TODOS: need to be optimized
    notes : Dexie.Table<INote,number>;
    
    constructor() { 
        super('db_note');
        
        this.version(1).stores({
            notes: '++id,content,tag,notebook,date,isdone',
        });

        this.notes = this.table("notes");

    }
}





