export class TimeFormatter {

    monthMapping:any = {'0':'Jan','1':'Feb','2':'Mar','3':'Apr','4':'May','5':'June','6':'July','7':'Aug','8':'Sept','9':'Oct','10':'Nov','11':'Dec'}

    timeString! : string;
    day!:string;
    month!:string;
    year!:string;

    constructor(timeString:string) {
        this.timeString = timeString;
        this.day = timeString.split('-')[0];
        this.month = timeString.split('-')[1];
        this.year = timeString.split('-')[2];
    }

    public getTimeatLocaleForDM(place:string): string {
        switch(place){
            case 'en':
                return this._parseTimeinEN();
                break;
            case 'cn':
                return this._parseTimeInCN();
                break; 
            default:
                return this._parseTimeinEN();
                break;

    
        }
    }

    private _parseTimeinEN() : string {
        return String(parseInt(this.day) + 1) + ' ' + this.monthMapping[this.month];
    }
    private _parseTimeInCN(): string{
        return String(parseInt(this.month) + 1) + '月'+String(parseInt(this.day) + 1) +'日';    
    }

}