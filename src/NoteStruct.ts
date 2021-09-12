import { DataLine } from "@element-plus/icons";

export class NoteStruct { 
    content : string;
    tag : string;
    notebook : string;
    date : number;
    isdone : number;

    constructor(content:string, tag:string, notebook:string , date:number, isdone:number){
        this.content = content;
        this.tag = tag;
        this.notebook = notebook;
        this.date = date;
        this.isdone = isdone;

    }
} 