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
import { ImageSource} from "tns-core-modules/image-source/image-source";
import { knownFolders } from "tns-core-modules/file-system/file-system";
import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import { DateTimePickerModelComponent } from "../DateTimePickerModel/DateTimePickerModel.component";
@Component({
    selector: "ReportsReminder",
    moduleId: module.id,
    templateUrl: "./reports.reminder.component.html"
})
export class ReportsReminderComponent implements OnInit {
    note: string;
    image: string;
    date = new Date();
    onbusy : boolean = false;
    DateStr : string ;
    TimeStr : string ;
    ngOnInit() {
        const currentdate = new Date(Date.now());
        this.DateStr = currentdate.toDateString();
        this.TimeStr = currentdate.toLocaleTimeString().slice(0, 9)
     }
    constructor(private vcRef: ViewContainerRef, private modal: ModalDialogService, private routerextension: RouterExtensions, private userservice: UserService) { }
    onNavBack() {
        this.routerextension.back();
    }
    onTimeChanged(args) {
        let timePicker = <TimePicker>args.object;
        this.date.setHours(timePicker.hour);
        this.date.setMinutes(timePicker.minute);
    }
    //date picker done
    onPickerLoaded(args){
        let datePicker = <DatePicker>args.object;
        this.date.setDate(datePicker.day);
        this.date.setMonth(datePicker.month);
        this.date.setFullYear(datePicker.year);
    }

    onDayChanged(arg) {
        this.date.setDate(arg.value);
    }
    onMonthChanged(arg) {
        this.date.setMonth(arg.value);
    }
    onYearChanged(arg) {
        this.date.setFullYear(arg.value);
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

    submit() {
        this.onbusy = true;
        let path: string = "Users/" + appSettings.getString("user_id") + "/" + appSettings.getString("vehicle_key") + "/Reminder";
        let data = {
            "Report_type": "Reminder",
            "Date": this.DateStr,
            "Time": this.TimeStr,
            "Note": this.note,
            "Image": this.image,
            "Image_path" : "-"
        };
            this.upload(path, data);
    }
    upload(path: string, data) {
        
        this.userservice.UploadData(path, data).then(() => {
            this.onbusy = false;
            this.routerextension.navigate(["/home"], {clearHistory : true});
        }).catch((error) => {
            console.log(error);
        });
    }
    showDate() {
        let options = {
            context: {
                isDate: true,
                isTime: false,
            },
            fullscreen: false,
            viewContainerRef: this.vcRef,
            //animate : true
        };
        this.modal.showModal(DateTimePickerModelComponent, options).then(res => {
            this.DateStr = res;
        });
    }
    showTime() {
        let options = {
            context: {
                isDate: false,
                isTime: true,
            },
            fullscreen: false,
            viewContainerRef: this.vcRef,
            //animate : true
        };
        this.modal.showModal(DateTimePickerModelComponent, options).then(res => {
            this.TimeStr = res;
        });
    }
}

