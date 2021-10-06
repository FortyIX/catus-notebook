import { tsThisType } from "@babel/types";
import { DataLine } from "@element-plus/icons";

export class WidgetStruct { 
    type:number;
    id:string;
    content:string;
    

    constructor(type:number,id:string,content:string){
        this.type = type;
        this.id = id;
        this.content = content;
    }  
} 