import { Component, OnInit } from "@angular/core";
import * as applicationModule from "tns-core-modules/application";
import { RouterExtensions } from "nativescript-angular/router";
import * as camera from "nativescript-camera";
import { Image } from "ui/image";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import * as appSettings from "tns-core-modules/application-settings";
//import { UserService } from "../shared/user.service";
import { ImageSource } from "tns-core-modules/image-source/image-source";
import { knownFolders } from "tns-core-modules/file-system/file-system";
import { VehicleService } from "../shared/vehicle.service";
import { Vehicle } from "../dataform-service/vehicle";
@Component({
    selector: "NewVehicle",
    moduleId: module.id,
    templateUrl: "./new_vehicle.component.html"
})
export class NewVehicleComponent implements OnInit {

    private _vehicle: Vehicle;
    /** 
    *  variable declare as below 
    **/
    plate_number: string;
    manufacturer = ["British Leyland", "BMW", "Chevrolet", "Chrysler-Rootes", "Datsun", "Ford", "Fiat", "Holden", "Mercedes-Benz", "Mitsubishi", "Mazda", "Opel", "Peugeot", "Renault", "Volvo", "Honda", "Toyota", "Volkswagen", "Vauxhall"];
    vehicle_list = ["car", "motor", "truck"];
    tank_cap: number;
    fuel_type = ["Ron 95", "Ron 97", "Diesel"];
    Odometer: number;
    image: string;
    picked_fuel_type: string;
    picked_manufacturer: string;
    picked_vehicle: string;
    onbusy: boolean = false;
    /**
     * function declare as below. 
     */
    constructor(private routerextension: RouterExtensions, private vehicleservice: VehicleService) { }
    onNavBack() {
        this.routerextension.back();
    }
    get vehicle(): Vehicle {
        return this._vehicle;
    }
    ngOnInit() {
        this._vehicle = new Vehicle(0, "KJC 1234", 0, 60, 0, 123456);
    }
    /**
     * take photo function.
     */
    onTakePicture() {

        camera.requestPermissions().then((result) => {
            this.takepic()
        }).catch((error) => {
            console.log(error);
        });
    }
    takepic() {
        camera.takePicture().
            then((imageAsset) => {
                var image = new Image();
                image.src = imageAsset;
                if (applicationModule.android) {
                    this.image = imageAsset.android;
                } else {
                    if (applicationModule.ios) {
                        let file = knownFolders.temp().getFile("PhotoImage.png");
                        let image_source = new ImageSource();
                        image_source.fromAsset(imageAsset).then((res) => {
                            res.saveToFile(file.path, "png");
                        }).then(() => {
                            this.image = file.path;
                        })
                            .catch((err) => {
                                console.log(err);
                            });
                    }
                }
            }).catch((err) => {
                console.log("Error -> " + err.message);
            });
    }
    /**
     * listpicker function. 
     */
    public selectedVehicle(args) {
        let picker = <ListPicker>args.object;
        this.picked_vehicle = this.vehicle_list[picker.selectedIndex];
    }
    public selectedManu(args) {
        let picker = <ListPicker>args.object;
        this.picked_manufacturer = this.manufacturer[picker.selectedIndex];
    }
    public selected_fuel_type(args) {
        let picker = <ListPicker>args.object;
        this.picked_fuel_type = this.fuel_type[picker.selectedIndex];
    }
    /**
     * save button function. 
     */
    saved() {
        /*
        let checker: boolean = true;
        let error: string = "";
        if (this.plate_number == null) {
            error += "\nPlease enter the plate number. ";
            checker = false;
        } else {
            if (this.plate_number.length > 8) {
                error += "\nPlease enter the correct plate number. ";
                checker = false;
            }
        }

        if (this.tank_cap > 80 || this.tank_cap < 20) {
            error += "\nPlease enter the correct vehicle tank capacity.(20 - 80) ";
            checker = false;
        }
        //normal odometer with 6 digit , some got 7 digit
        if (this.Odometer > 9999999 || this.Odometer <= 0) {
            error += "\nPlease enter the correct odometer reading.(0000000 - 9999999) ";
            checker = false;
        }
        if (checker) {
            this.savecontent();
        } else {
            alert(error);
        }
*/
        this.savecontent();
    }
    savecontent() {
        this.onbusy = true;
        // let path: string = "Users/" + appSettings.getString("user_id") + "/Vehicles";
        
        let a = {
            "Image": this.image,
            "type": this.vehicle_list[this.vehicle.vehicle_type],
            "plate_no": this.vehicle.plate_number.toLocaleUpperCase(),
            "manufacturer": this.manufacturer[this.vehicle.manufacturer],
            "tank_capacity": this.vehicle.tank_capacity,
            "fuel_type": this.fuel_type[this.vehicle.fuel_type],
            "odometer": this.vehicle.odometer,
            "Image_path": "-",
            "current_Odo": this.vehicle.odometer,
        };
        this.vehicleservice.NewVehicle(a).then(() => {
            this.onbusy = false;
        }).then(() => {
            this.routerextension.navigate(["/home"], { clearHistory: true });
        }).catch((error) => {
            console.log(error);
        });
    }

}
