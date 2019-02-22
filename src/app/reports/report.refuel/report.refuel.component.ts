import * as geoLocation from "nativescript-geolocation";
import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { registerElement } from 'nativescript-angular/element-registry';
import * as camera from "nativescript-camera";
import * as applicationModule from "tns-core-modules/application";
import { Image } from "ui/image";
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';
import { TimePicker } from "tns-core-modules/ui/time-picker/time-picker";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { UserService } from "../../shared/user.service";
import * as imagepicker from "nativescript-imagepicker";
import * as appSettings from "tns-core-modules/application-settings";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { DatePicker } from "tns-core-modules/ui/date-picker";
import { ImageSource } from "tns-core-modules/image-source/image-source";
import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import { knownFolders } from "tns-core-modules/file-system/file-system";
import { VehicleService } from "../../shared/vehicle.service";
import { RefuelReport } from "../../dataform-service/reports";
registerElement("MapView", () => require("nativescript-google-maps-sdk").MapView);

/*
the data will only submit when pressed, wont resubmit again when refresh or nvaigated
*/
@Component({
    selector: "ReportRefuel",
    moduleId: module.id,
    templateUrl: "./report.refuel.component.html",
})
export class ReportsRefuelComponent implements OnInit {

    private _refuel_report : RefuelReport ;
    //variable declare here
    onbusy: boolean = false;
    note: string = "";
    Odometer: number;
    latitude = 0;
    longitude = 0;
    zoom = 20;
    mapview: MapView;
    currentGeoLocation = false;
    checkMaponLoad: boolean = false;
    date = new Date(Date.now());
    fueltype = ["Ron 95", "Ron 97", "Diesel"];
    pickedFuelType;
    fuelPrice: number = 23.50;
    fuelAmount: string;
    fuelVolume: string = "0.00";
    image: string;
    Odo_hint: number = appSettings.getNumber("Odo");
    DateStr: string;
    TimeStr: string;
    //constructor
    constructor(private vcRef: ViewContainerRef, private modal: ModalDialogService, private router: Router, private routerextension: RouterExtensions, private userservice: UserService, private vehicleservice: VehicleService) { }

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
    //on init
    ngOnInit() {
        const currentdate = new Date(Date.now());
        const date = currentdate.getFullYear().toString() + "-" + (currentdate.getMonth() +1).toString()+"-" + currentdate.getDate().toString();
        const time = currentdate.getHours().toString() + ":" + currentdate.getMinutes().toString();

        this._refuel_report = new RefuelReport( date , time ,0 , 0 , 2.05 , 0 , appSettings.getNumber("Odo") , "");
    }
    get report(): RefuelReport {
        return this._refuel_report;
    }
    //for mapview usage
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
        marker.title = "Refuel position";
        marker.snippet = "Point";
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

    public onPropertyValidate(args) {
        if (args.propertyName === "Amount") {
            this._refuel_report.Fuel_Volume = parseFloat((this._refuel_report.Amount / this._refuel_report.Fuel_price ).toFixed(2));
            console.log(this._refuel_report.Fuel_Volume.toFixed(2));
        }
    }

    onNavBack() {
        this.routerextension.back();
    }
    validation() {
        /*
        let checker: boolean = true;
        let error: string = "";
        if (this.Odometer == null) {
            this.Odometer = this.Odo_hint + 1;
        }
        if (this.fuelAmount == null) {
            error += "\nPlease enter the Amount paid. ";
            checker = false;
        }
        //normal odometer with 6 digit , some got 7 digit
        if (this.Odometer > 9999999 || this.Odometer < 0) {
            error += "\nPlease enter the correct odometer reading.(0000000 - 9999999) ";
            checker = false;
        }
        if (checker) {
            this.submit();
        } else {
            alert(error);
        }*/
        this.submit();
    }
    submit() {
        this.onbusy = true;
        const newdate = new Date(this._refuel_report.date);

        let data = {
            "Report_type": "Refuel",
            "Date": newdate.toDateString(),
            "Time": this._refuel_report.time,
            "Location": {
                "latitude": this.latitude,
                "longitude": this.longitude
            },
            "Fuel_type": this.fueltype[this._refuel_report.fuel_type],
            "Fuel_price": this._refuel_report.Fuel_price,
            "Amount": this._refuel_report.Amount,
            "Fuel_Volume": this._refuel_report.Fuel_Volume,
            "Odometer": this._refuel_report.odometer,
            "Note": this._refuel_report.note,
            "Image": this.image,
            "Image_path": "-"
        };
        this.upload(data);
    }
    onBlur(args) {
        args.object.dismissSoftInput();
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
