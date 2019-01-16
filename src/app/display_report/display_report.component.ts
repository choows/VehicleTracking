import { Component, OnInit } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/directives/dialogs";

@Component({
    selector: "DisplayReport",
    moduleId: module.id,
    templateUrl: "./display_report.component.html"
})
export class DisplayReportComponent implements OnInit {
    constructor(private mParams: ModalDialogParams) {
        this.report_type = mParams.context.report_type;
        this.date = mParams.context.date;
        this.time = mParams.context.time;
        this.fuel_type = mParams.context.fuel_type;
        this.fuel_price = mParams.context.fuel_price;
        this.amount_paid = mParams.context.amount_paid;
        this.total_volume = mParams.context.total_volume;
        this.location = mParams.context.location;
        this.odometer = mParams.context.odometer;
        this.note = mParams.context.note;
        this.photo = mParams.context.photo;
        this.parts = mParams.context.parts;
        this.expenses_type = mParams.context.expenses_type;
        this.insurance_type = mParams.context.insurance_type;
        this.insurance_company = mParams.context.insurance_company;
        this.remind_before = mParams.context.remind_before;
    }
    icon = "";
    report_type = "";
    date = "";
    time;
    fuel_type;
    amount_paid;
    fuel_price;
    total_volume;
    location;
    odometer;
    note;
    photo;
    parts;
    expenses_type;
    insurance_type;
    insurance_company;
    remind_before;
    isRefuel: boolean = false;
    isService: boolean = false;
    isExpenses: boolean = false;
    isInsurance: boolean = false;
    isReminder: boolean = false;
    image_enlarge = false;
    ngOnInit() {
        /*
        if (this.location.latitude == 0 || this.location.longitude == 0) {
            this.location = "No Location is provided.";
        } else {
            let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + this.location.latitude + "," + this.location.longitude + "&&key=AIzaSyDRfjOnHTI8ztt1MZ6PmI5PqiE1LJ2QjUA";
            getString(url).then((result) => {
                // let address = result["results"]["address_components"].long_name;
                // this.location = address;
                console.log(result);
            })
        }
        */
        /*
        this.http.get(url)
            .map(results => results.json())
            .subscribe(results => {
                    console.log("address " + results.results[0].formatted_address);
            }, error => {
                console.log("ERROR: ", error);
            });*/
        this.icon = "res://" + this.report_type.toLocaleLowerCase();
        switch (this.report_type) {
            case "Service": {
                this.isService = true;
                break;
            }
            case "Refuel": {
                this.isRefuel = true;
                break;
            }
            case "Expenses": {
                this.isExpenses = true;
                break;
            }
            case "Insurance": {
                this.isInsurance = true;
                break;
            }
            case "Reminder": {
                this.isReminder = true;
                break;
            }
            default: {
                break;
            }
        }
    }
    close() {
        this.mParams.closeCallback(null);
    }
    change_size(args) {
        let photo = args.object;
        if (!this.image_enlarge) {
            photo.width += 300;
            photo.height +=500;
            this.image_enlarge = true;
        }else{
            photo.width -= 300;
            photo.height -= 500;
            this.image_enlarge = false;
        }

    }

}
