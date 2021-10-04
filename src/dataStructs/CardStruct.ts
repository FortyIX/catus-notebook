import { tsThisType } from "@babel/types";
import { DataLine } from "@element-plus/icons";

export class CardStruct { 
    content : string;
    submitDate:string;
    date : number;
    reminderMsg : string;
    tag : string;
    notebook : string
    isdone : number;
    id? : number
    cardType? : boolean
    datePlateID? : string

    constructor(content:string,submitDate:string,tag:string,notebook:string, date:number,reminderMsg:string,isdone:number,id?: number,cardType?:boolean, datePlateID? : string){
        this.content = content;
        this.submitDate = submitDate;
        this.date = date;
        this.reminderMsg = reminderMsg;
        this.isdone = isdone;
        this.tag = tag;
        this.notebook = notebook;
        this.id = id;
        this.cardType = cardType;
        this.datePlateID = datePlateID
    }

    
} 