import { Component, OnInit , ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import * as camera from "nativescript-camera";
import { Image } from "ui/image";
import * as applicationModule from "tns-core-modules/application";
import { TimePicker } from "tns-core-modules/ui/time-picker/time-picker";
import * as appSettings from "tns-core-modules/application-settings";
import { UserService } from "../../shared/user.service";
import { DatePicker } from "tns-core-modules/ui/date-picker";
import * as imagepicker from "nativescript-imagepicker";
import { ImageSource} from "tns-core-modules/image-source/image-source";
import { knownFolders } from "tns-core-modules/file-system/file-system";
import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import { DateTimePickerModelComponent } from "../DateTimePickerModel/DateTimePickerModel.component";
import { VehicleService } from "../../shared/vehicle.service";
import { ReminderReport } from "../../dataform-service/reports";
import * as dialogs from "tns-core-modules/ui/dialogs";

@Component({
    selector: "ReportsReminder",
    moduleId: module.id,
    templateUrl: "./reports.reminder.component.html"
})
export class ReportsReminderComponent implements OnInit {
    private _reminder_report : ReminderReport;
    note: string;
    image: string;
    date = new Date();
    onbusy : boolean = false;
    DateStr : string ;
    TimeStr : string ;
    ngOnInit() {
        const currentdate = new Date(Date.now());
        const date = currentdate.getFullYear().toString() + "-" + (currentdate.getMonth() +1).toString()+"-" + currentdate.getDate().toString();
        const time = currentdate.getHours().toString() + ":" + currentdate.getMinutes().toString();
        this._reminder_report = new ReminderReport(date , time , "" );
       
     }
     get report() : ReminderReport{
         return this._reminder_report;
     }
    constructor(private vcRef: ViewContainerRef,private vehicleservice : VehicleService, private modal: ModalDialogService, private routerextension: RouterExtensions, private userservice: UserService) { }
    onNavBack() {
        this.routerextension.back();
    }
    Photo(){
        dialogs.action({
            message: "Please select your action",
            cancelButtonText: "Cancel",
            actions: ["Take Photo", "Pick From Library"]
        }).then(result => {
            if (result == "Take Photo") {
                this.onTakePicture();
            } else if (result == "Pick From Library") {
                this.onPick();
            }
        });
    }
    //for camera usage
    onTakePicture() {
        camera.requestPermissions().then(() => {
            this.photo();
        }).catch((error) => {
            console.log(error);
        });
    }
    photo() {
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
                        image_source.fromAsset(imageAsset).then((res)=>{
                            res.saveToFile(file.path , "png");
                            
                        }).then(()=>{
                            this.image = file.path;
                        })
                        .catch((err)=>{
                            console.log(err);
                        });
                    } else {
                        throw (DOMException);
                    }
                }
            }).catch((err) => {
                console.log("Error -> " + err.message);
            });
    }
    onPick(){
        let context = imagepicker.create({
            mode: "single"
        });
        let file = knownFolders.temp().getFile("Tempo.png");
        context
            .authorize()
            .then(function () {
                return context.present();
            })
            .then(function (selection) {
                selection.forEach(function (selected) {
                        let image_source = new ImageSource();
                        image_source.fromAsset(selected).then((result) => {
                            result.saveToFile(file.path, "png");
                        }).catch((err) => {
                            console.log(err);
                        });
                });
            }).then((res) => {
               this.image = file.path;
            }).catch(function (e) {
                console.log(e);
            });
    }
    submit() {
        this.onbusy = true;
        const newdate = new Date(this._reminder_report.date);
        let data = {
            "Report_type": "Reminder",
            "Date": newdate.toDateString(),
            "Time": this._reminder_report.time,
            "Note": this._reminder_report.note,
            "Image": this.image,
            "Image_path" : "-"
        };
            this.upload(data);
    }
    upload (data) {
        
        this.vehicleservice.NewReport(data).then(() => {
            this.onbusy = false;
            this.routerextension.navigate(["/home"], { clearHistory: true });
        }).catch((error) => {
            console.log(error);
        });
    }
}

