import { tsThisType } from "@babel/types";
import { DataLine } from "@element-plus/icons";

export class NoteStruct { 
    content : string;
    date : number;
    tag : string;
    notebook : string
    isdone : number;

    constructor(content:string,tag:string,notebook:string, date:number,isdone:number){
        this.content = content;
        this.date = date;
        this.isdone = isdone;
        this.tag = tag;
        this.notebook = notebook;
    }

    
} 