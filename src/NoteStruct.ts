import { tsThisType } from "@babel/types";
import { DataLine } from "@element-plus/icons";

export class NoteStruct { 
    content : string;
    date : number;
    reminderMsg : string;
    tag : string;
    notebook : string
    isdone : number;
    id? : number

    constructor(content:string,tag:string,notebook:string, date:number,reminderMsg:string,isdone:number,id?: number){
        this.content = content;
        this.date = date;
        this.reminderMsg = reminderMsg;
        this.isdone = isdone;
        this.tag = tag;
        this.notebook = notebook;
        this.id = id;
    }

    
} 