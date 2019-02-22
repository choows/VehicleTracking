import { Component, OnInit } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/directives/dialogs";
import { VehicleDetail } from "../../dataform-service/vehicle";
/* ***********************************************************
* Before you can navigate to this page from your app, you need to reference this page's module in the
* global app router module. Add the following object to the global array of routes:
* { path: "VehicleDetail", loadChildren: "./VehicleDetail/VehicleDetail.module#VehicleDetailModule" }
* Note that this simply points the path to the page module file. If you move the page, you need to update the route too.
*************************************************************/

@Component({
    selector: "VehicleDetail",
    moduleId: module.id,
    templateUrl: "./VehicleDetail.component.html"
})
export class VehicleDetailComponent implements OnInit {
    plate_num : string;
    Image : string;
    Odometer : number;
    Manufacturer : string;
    Tank_capacity : number;
    Type : string;
    Next_Service_Date : string;
    Next_Service_Odometer : number;
    Refuel : number;
    Service : number;
    Insurance : number;
    Expenses : number;
    private _VehicleDetail : VehicleDetail ; 
    constructor(private mParams: ModalDialogParams) {
        this.plate_num = mParams.context.Plate_no;
        this.Image = mParams.context.Image;
        this.Odometer = mParams.context.Odometer;
        this.Manufacturer = mParams.context.Manufacturer;
        this.Tank_capacity = mParams.context.Tank_Capacity;
        this.Type = mParams.context.Type;
        this.Next_Service_Date = mParams.context.Next_Service_Date;
        this.Next_Service_Odometer = mParams.context.Next_Service_Odometer;
        this.Refuel = mParams.context.Refuel;
        this.Service = mParams.context.Service;
        this.Insurance = mParams.context.Insurance;
        this.Expenses = mParams.context.Expenses;
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/
    }

    ngOnInit(): void {

        this._VehicleDetail = new VehicleDetail(this.plate_num, this.Odometer , this.Manufacturer ,this.Tank_capacity , this.Type , this.Next_Service_Date , this.Next_Service_Odometer , this.Refuel , this.Service , this.Expenses , this.Insurance);
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
    }
    get reports() : VehicleDetail{
        return this._VehicleDetail;
    }
    close(){
        this.mParams.closeCallback(()=>{
            return null;
        });
    }

}
