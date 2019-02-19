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