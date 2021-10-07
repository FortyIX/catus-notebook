import { thisTypeAnnotation } from "@babel/types";
import Dexie, { IndexableType } from "dexie";


export interface ICard{
    id? : number;
    content : string;
    submitDate:string;
    date : number;
    reminderMsg : string;
    tag:string;
    notebook:string;
    isdone : number;
    type:number;
}

export interface IWidget{
    id: string;
    type: number;
    content:string;
}

export interface INotebooks{
    id?:number;
    name:string;
}

export interface ITags{
    id?:number;
    name:string;
}

export class Database extends Dexie {
    
    //TODOS: need to be optimized
    card : Dexie.Table<ICard,number>;
    notebooks : Dexie.Table<INotebooks,number>;
    tags:Dexie.Table<ITags,number>;
    widget : Dexie.Table<IWidget,string>;
    
    constructor() { 
        super('db_note');
        
        this.version(1).stores({
            card: '++id,content,submitDate,tag,notebook,date,reminderMsg,isdone,type',
            notebooks: '++id, name',
            tags:'++id,name',
            widget:'id,type,content'
        });

        this.card = this.table("card");
        this.notebooks = this.table("notebooks");
        this.tags = this.table('tags');
        this.widget = this.table('widget');

    }
}





