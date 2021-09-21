import { tsThisType } from "@babel/types";
import { DataLine } from "@element-plus/icons";

export class NotebookItem { 
    name : string
    id? : number

    constructor(name:string,id?: number){
        this.name = name;
        this.id = id;
    }  
} 