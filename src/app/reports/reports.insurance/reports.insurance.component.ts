import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import { alert} from "tns-core-modules/ui/dialogs";
import { RouterExtensions } from "nativescript-angular/router";
import * as camera from "nativescript-camera";
import { Image } from "ui/image";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import * as applicationModule from "tns-core-modules/application";
import * as appSettings from "tns-core-modules/application-settings";
import { UserService } from "../../shared/user.service";
import * as imagepicker from "nativescript-imagepicker";
import { DatePicker } from "tns-core-modules/ui/date-picker";
import { ImageSource} from "tns-core-modules/image-source/image-source";
import { knownFolders } from "tns-core-modules/file-system/file-system";
import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import { DateTimePickerModelComponent } from "../DateTimePickerModel/DateTimePickerModel.component";
@Component({
    selector: "ReportsInsurance",
    moduleId: module.id,
    templateUrl: "./reports.insurance.component.html"
})
export class ReportsInsuranceComponent implements OnInit {
    
    image: string;
    insuranceAmount : string;
    insuranceCompany = ["Allianz", "Tokio Merine", "AXA", "UniAsia", "RHB Insurance", "Lonpac", "Berjaya Sampa", "Kurnia"];
    insurancetype = ["Third Party Cover", "Third Party , Fire , Thief Cover", "Comprehensve Cover"];
    note: "";
    date = new Date(Date.now());
    pickedCompany: string;
    pickedType: string;
    onbusy : boolean = false;
    DateStr : string ;
    ngOnInit() {
        this.DateStr = new Date(Date.now()).toDateString() ;
    }
    constructor(private vcRef: ViewContainerRef, private modal: ModalDialogService, private routerextension: RouterExtensions, private userservice: UserService) { }
    onNavBack() {
        this.routerextension.back();
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
    selectedcompany(args) {
        let picker = <ListPicker>args.object;
        this.pickedCompany = this.insuranceCompany[picker.selectedIndex];
    }
    selectedtype(args) {
        let picker = <ListPicker>args.object;
        this.pickedType = this.insurancetype[picker.selectedIndex];
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
    //for date picker usage

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
    validation(){
        let checker: boolean = true;
        let error: string = "";
        if (this.insuranceAmount == null) {
            error += "\nPlease enter the Amount paid. ";
            checker = false;
        }
        if (checker) {
            this.submit();
        } else {
            alert(error);
        }
    }
    submit() {
        this.onbusy = true;
        let path: string = "Users/" + appSettings.getString("user_id") + "/" + appSettings.getString("vehicle_key") + "/Insurance";
        let data = {
            "Report_type": "Insurance",
            "Date":  this.DateStr,
            "Note": this.note,
            "Image": this.image,
            "Amount": parseFloat(this.insuranceAmount),
            "Company": this.pickedCompany,
            "Type": this.pickedType,
            "Image_path" : "-"
        }
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
}

