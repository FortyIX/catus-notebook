import { tsThisType } from "@babel/types";
import { DataLine } from "@element-plus/icons";

export class TagItem { 
    name : string
    id? : number

    constructor(name:string,id?: number){
        this.name = name;
        this.id = id;
    }  
} 