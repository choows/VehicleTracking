import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import * as geoLocation from "nativescript-geolocation";
import * as camera from "nativescript-camera";
import { Image } from "ui/image";
import * as applicationModule from "tns-core-modules/application";
import * as appSettings from "tns-core-modules/application-settings";
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';
import { TimePicker } from "tns-core-modules/ui/time-picker/time-picker";
import * as imagepicker from "nativescript-imagepicker";
import { UserService } from "../../shared/user.service";
import { DatePicker } from "tns-core-modules/ui/date-picker";
import { ImageSource} from "tns-core-modules/image-source/image-source";
import { knownFolders } from "tns-core-modules/file-system/file-system";
import { ServiceReport } from "../../dataform-service/reports";
import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { DateTimePickerModelComponent } from "../DateTimePickerModel/DateTimePickerModel.component";
import { VehicleService } from "../../shared/vehicle.service";

@Component({
    selector: "ReportsService",
    moduleId: module.id,
    templateUrl: "./reports.service.component.html"
})

export class ReportsServiceComponent implements OnInit {

    private _service_Report : ServiceReport;
    note: string;
    data = [];
    serviceAmount: string;
    latitude = 0;
    longitude = 0;
    zoom = 20;
    mapview: MapView;
    image: string;
    Odometer: number;
    odo_hint = appSettings.getNumber("Odo");
    currentGeoLocation = false;
    date: Date;
    onbusy: boolean = false;
    NextService_Odometer : number ;
    DateStr : string ;
    TimeStr : string 
    //checkbox purpose
    checker(args) {
        if (!args.object.checked) {
            this.data.push(args.object.text);
        } else {
            while (this.data.indexOf(args.object.text) != null) {
                let index_num: number = this.data.indexOf(args.object.text);
                let new_arr = this.data.splice(index_num + 1);
                this.data.pop();
                this.data = this.data.concat(new_arr);
            }
            console.log(args.object.text + " unchecked");
        }
    }
    ngOnInit() {
        const currentdate = new Date(Date.now());
        const date = currentdate.getFullYear().toString() + "-" + (currentdate.getMonth() +1).toString()+"-" + currentdate.getDate().toString();
        const nxt_date = currentdate.getFullYear().toString() + "-" + (currentdate.getMonth() +7).toString()+"-" + currentdate.getDate().toString();

        const time = currentdate.getHours().toString() + ":" + currentdate.getMinutes().toString();
        this._service_Report = new ServiceReport(0 , date , time , appSettings.getNumber("Odo") , "" , appSettings.getNumber("Odo") + 5000 ,nxt_date );
    }
    constructor(private vcRef: ViewContainerRef,private vehicleservice: VehicleService, private modal: ModalDialogService,private routerextension: RouterExtensions, private userservice: UserService) { }
    onNavBack() {
        this.routerextension.back();
    }

    get report() : ServiceReport{
        return this._service_Report;
    }

    
    //mapview component below
    enableLocationServices(): void {
        geoLocation.isEnabled().then(enabled => {
            if (!enabled) {
                geoLocation.enableLocationRequest().then(() => this.setLocation());
            } else {
                this.setLocation();
            }
        });
    }

    private setLocation(): void {
        this.currentGeoLocation = true;
        geoLocation.getCurrentLocation({
            desiredAccuracy: 3,
            updateDistance: 10,
            minimumUpdateTime: 1000 * 1
        }).then((location) => {
            this.latitude = location.latitude;
            this.longitude = location.longitude;
        }).catch((error) => {
            console.log(error);
        })
    }
    onMapReady(args) {
        this.mapview = args.object;
        this.mapview.latitude = this.latitude;
        this.mapview.longitude = this.longitude;
    }
    disableMap() {
        this.currentGeoLocation = false;
    }

    onCoordinateTapped(args) {
        this.mapview = args.object;
        this.mapview.removeAllMarkers();
        var marker = new Marker();
        marker.position = Position.positionFromLatLng(this.mapview.latitude, this.mapview.longitude);
        marker.title = "Service position";
        marker.snippet = this.date.getDate().toString();
        marker.userData = { index: 1 };
        this.mapview.addMarker(marker);
        this.latitude = this.mapview.latitude;
        this.longitude = this.mapview.longitude;
        marker.draggable = false;
    }

    onCameraChanged(args) {
        this.mapview = args.object;
        this.onCoordinateTapped(args);
    }
    onPick() {
        let file = knownFolders.temp().getFile("Tempo.png");
        let context = imagepicker.create({
            mode: "single"
        });
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
    //camera component below
    onTakePicture() {
        console.log(this.image);
        
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
                        image_source.fromAsset(imageAsset).then((res) => {
                            res.saveToFile(file.path, "png");
                        }).then(() => {
                            this.image = file.path;
                        })
                            .catch((err) => {
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
    validation() {
        this.submit();
    }
    //submit button
    submit() {
        this.onbusy = true;
        let current_date: string = this.date.toDateString();
        const newdate = new Date(this._service_Report.date);
        const servicedate = new Date(this._service_Report.next_date);
        let data = {
            "Report_type": "Service",
            "Date": newdate.toDateString(),
            "Time": this._service_Report.time,
            "Location": {
                "latitude": this.latitude,
                "longitude": this.longitude
            },
            "Odometer": this._service_Report.odometer,
            "Note": this._service_Report.note,
            "Image": this.image,
            "Amount": this._service_Report.Amount,
            "Parts": this.data.toString(),
            "Image_path" : "-"
        };
        const nxt= {
            Date : servicedate.toDateString(),
            Odometer : this._service_Report.next_odometer,
        }
        this.userservice.NxtService(nxt);
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
