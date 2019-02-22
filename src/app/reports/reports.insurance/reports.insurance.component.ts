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
import { VehicleService } from "../../shared/vehicle.service";
import { InsuranceReport } from "../../dataform-service/reports";
import * as dialogs from "tns-core-modules/ui/dialogs";


@Component({
    selector: "ReportsInsurance",
    moduleId: module.id,
    templateUrl: "./reports.insurance.component.html"
})
export class ReportsInsuranceComponent implements OnInit {
    
    private _insurance_report : InsuranceReport;
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
        const currentdate = new Date(Date.now());
        const date = currentdate.getFullYear().toString() + "-" + (currentdate.getMonth() +1).toString()+"-" + currentdate.getDate().toString();
        this._insurance_report = new InsuranceReport(date , 0 , "",0,0);
    }
    get reports() : InsuranceReport{
        return this._insurance_report;
    }
    constructor(private vcRef: ViewContainerRef,private vehicleservice : VehicleService, private modal: ModalDialogService, private routerextension: RouterExtensions, private userservice: UserService) { }
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
    validation(){
       this.submit();
    }
    submit() {
        this.onbusy = true;
        const newdate = new Date(this._insurance_report.date);

        let data = {
            "Report_type": "Insurance",
            "Date":  newdate.toDateString(),
            "Note": this._insurance_report.note,
            "Image": this.image,
            "Amount": this._insurance_report.Amount,
            "Company": this.insuranceCompany[this._insurance_report.Company],
            "Type": this.insurancetype[this._insurance_report.Insurance_type],
            "Image_path" : "-"
        }
            this.upload(data);
    }
    upload(data) {
        this.vehicleservice.NewReport(data).then(() => {
            this.onbusy = false;
            this.routerextension.navigate(["/home"], { clearHistory: true });
        }).catch((error) => {
            console.log(error);
        });
    }
}

