
export class RefuelReport{

    public Amount : number;
    public date : string;
    public time : string ;
    public Fuel_Volume : number;
    public Fuel_price : number;
    public fuel_type : number;
    public odometer : number;
    public note : string ;

    constructor( date : string , time : string ,Amount : number , fuel_volume : number , fuel_price : number , fuel_type : number , odometer : number , note : string){
        this.Amount = Amount;
        this.date= date;
        this.time= time;
        this.fuel_type= fuel_type;
        this.odometer = odometer ; 
        this.Fuel_price = fuel_price;
        this.Fuel_Volume = fuel_volume ;
        this.note = note;
    }

}
export class ExpensesReport{
    public Amount : number;
    public date : string;
    public time : string ;
    public Expenses_type : number;
    public odometer : number;
    public note : string ;

    constructor( date : string , time : string ,Amount : number,expenses_type : number , odometer : number , note : string){
        this.Amount = Amount;
        this.date= date;
        this.time= time;
        this.odometer = odometer ; 
        this.Expenses_type = expenses_type;
        this.note = note;
    }

}
export class InsuranceReport{
    public Amount : number;
    public date : string;
    public Insurance_type : number;
    public Company : number;
    public note : string ;

    constructor( date : string ,Amount : number , note : string, Insurance_type : number , Company : number){
        this.Amount = Amount;
        this.date= date;
        this.Company = Company;
        this.Insurance_type = Insurance_type;
        this.note = note;
    }

}
export class ServiceReport{
    public Amount : number;
    public date : string;
    public time : string ;
    public odometer : number;
    public note : string ;
    public next_odometer : number ;
    public next_date : string ;
    public parts: Array<String>;
    constructor(amount : number ,date : string , time : string , odometer : number , note : string , nxt_odo : number , nxt_date : string , parts : Array<String>){
        this.Amount = amount;
        this.date = date;
        this.next_date = nxt_date;
        this.next_odometer = nxt_odo;
        this.note = note;
        this.odometer = odometer;
        this.time = time;
        this.parts = parts ;
    }
}
export class ReminderReport{
    public date : string;
    public time : string ;
    public note : string ;

    constructor(date : string , time : string , note : string){
        this.date = date ; 
        this.note = note ;
        this.time = time;
    }
}