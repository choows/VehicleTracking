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
import { DatePicker } from "tns-core-modules/ui/date-picker";
import { ImageSource } from "tns-core-modules/image-source/image-source";
import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import { DateTimePickerModelComponent } from "../DateTimePickerModel/DateTimePickerModel.component";
import { knownFolders } from "tns-core-modules/file-system/file-system";
import { VehicleService } from "../../shared/vehicle.service";
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
    constructor(private vcRef: ViewContainerRef, private modal: ModalDialogService, private router: Router, private routerextension: RouterExtensions, private userservice: UserService , private vehicleservice :VehicleService) { }

    //on init
    ngOnInit() {
        const currentdate = new Date(Date.now());
        this.DateStr = currentdate.toDateString();
        this.TimeStr = currentdate.toLocaleTimeString().slice(0, 9)
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

    //picker
    selectedtype(args) {
        let picker = <ListPicker>args.object;
        this.pickedFuelType = this.fueltype[picker.selectedIndex];
    }

    //for time picker usage
    onTimeChanged(args) {
        let timePicker = <TimePicker>args.object;
        this.date.setHours(timePicker.hour);
        this.date.setMinutes(timePicker.minute);
    }

    //for date picker usage
    onPickerLoaded(args) {
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

    //for converting the fuel price
    ontextchange() {
        this.fuelVolume = (parseFloat(this.fuelAmount) / this.fuelPrice).toFixed(2);
    }

    onNavBack() {
        this.routerextension.back();
    }
    validation() {
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
        }
    }
    submit() {
        this.onbusy = true;
        this.ontextchange();
        let data = {
            "Report_type": "Refuel",
            "Date": this.DateStr,
            "Time": this.TimeStr,
            "Location": {
                "latitude": this.latitude,
                "longitude": this.longitude
            },
            "Fuel_type": this.pickedFuelType,
            "Fuel_price": this.fuelPrice,
            "Amount": parseFloat(this.fuelAmount),
            "Fuel_Volume": this.fuelVolume,
            "Odometer": parseInt(this.Odometer.toString()),
            "Note": this.note,
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
