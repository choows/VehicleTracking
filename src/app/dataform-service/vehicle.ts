export class Vehicle {
    public vehicle_type: number;
    public plate_number: string;
    public manufacturer: number;
    public tank_capacity: number;
    public fuel_type: number;
    public odometer: number;
    constructor(vehicle_type: number, plate_number: string, manufacturer: number, tank_cap: number, fuel_type: number, odometer: number) {
        this.vehicle_type = vehicle_type;
        this.plate_number = plate_number;
        this.manufacturer = manufacturer;
        this.tank_capacity = tank_cap;
        this.fuel_type = fuel_type;
        this.odometer = odometer;
    }
}

export class VehicleDetail{
   public plate_num :string; 
   public Odometer : number ; 
   public Manufacturer : string;
   public Tank_capacity :number;
   public Type : string;
   public Next_Service_Date : string;
   public Next_Service_Odometer : number;
   public Refuel : number;
   public Service : number;
   public Insurance : number;
   public Expenses : number;
   constructor(plate_num : string, Odometer: number , Manufacturer : string , Tank_cap : number,
    type : string, Nxt_date : string , Nxt_odo : number , Refuel : number , Service:number , Expenses : number
    , Insurance : number){
        this.plate_num = plate_num;
        this.Odometer = Odometer;
        this.Manufacturer = Manufacturer;
        this.Tank_capacity = Tank_cap;
        this.Type = type;
        this.Next_Service_Date = Nxt_date;
        this.Next_Service_Odometer = Nxt_odo;
        this.Refuel = Refuel;
        this.Service = Service;
        this.Insurance = Insurance;
        this.Expenses = Expenses;
    }
}