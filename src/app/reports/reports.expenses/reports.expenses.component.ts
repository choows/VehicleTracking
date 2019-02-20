import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import * as applicationModule from "tns-core-modules/application";
import { RouterExtensions } from "nativescript-angular/router";
import * as geoLocation from "nativescript-geolocation";
import * as camera from "nativescript-camera";
import { ImageSource } from "tns-core-modules/image-source/image-source";
import { knownFolders } from "tns-core-modules/file-system/file-system";
import { Image } from "ui/image";
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';
import { TimePicker } from "tns-core-modules/ui/time-picker/time-picker";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import * as appSettings from "tns-core-modules/application-settings";
import { UserService } from "../../shared/user.service";
import { DatePicker } from "tns-core-modules/ui/date-picker";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as imagepicker from "nativescript-imagepicker";
import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import { DateTimePickerModelComponent } from "../DateTimePickerModel/DateTimePickerModel.component";
import { VehicleService } from "../../shared/vehicle.service";
import { ExpensesReport } from "../../dataform-service/reports";

@Component({
    selector: "ReportsExpenses",
    moduleId: module.id,
    templateUrl: "./reports.expenses.component.html",
})
export class ReportsExpensesComponent implements OnInit {
    private _expensesReport : ExpensesReport;
    onbusy: boolean = false;
    latitude = 0;
    longitude = 0;
    zoom = 20;
    odo_hint = appSettings.getNumber("Odo");
    mapview: MapView;
    Odometer: number;
    currentGeoLocation = false;
    checkMaponLoad: boolean = false;
    expensestype = ["toll", "parking", "car wash", "others"];
    expensesAmount: string;
    date = new Date(Date.now());
    pickedexpensestype;
    image: string;
    note: string;
    DateStr: string;
    TimeStr: string;
    ngOnInit() {
        const currentdate = new Date(Date.now());
        const date = currentdate.getFullYear().toString() + "-" + (currentdate.getMonth() +1).toString()+"-" + currentdate.getDate().toString();
        const time = currentdate.getHours().toString() + ":" + currentdate.getMinutes().toString();
        this._expensesReport = new ExpensesReport(date , time , 0 , 0 , appSettings.getNumber("Odo") , "");
    }
    get report(): ExpensesReport {
        return this._expensesReport;
    }
    constructor(private vcRef: ViewContainerRef, private modal: ModalDialogService, private vehicleservice: VehicleService, private routerextension: RouterExtensions, private userservice: UserService) { }
    onNavBack() {
        this.routerextension.back();
    }

    //for mapview
    enableLocationServices(): void {
        geoLocation.isEnabled().then(enabled => {
            if (!enabled) {
                geoLocation.enableLocationRequest().then(() => this.setLocation());
            } else {
                this.setLocation();
            }
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
        marker.title = "Expenses";
        marker.snippet = this.pickedexpensestype;
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
    //for camera
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
    validation() {
        this.submit();
    }
    submit() {
        this.onbusy = true;
        const newdate = new Date(this._expensesReport.date);

        let data = {
            "Report_type": "Expenses",
            "Date": newdate.toDateString(),
            "Time": this._expensesReport.time,
            "Location": {
                "latitude": this.latitude,
                "longitude": this.longitude
            },
            "Odometer": this._expensesReport.odometer,
            "Note": this._expensesReport.note,
            "Image": this.image,
            "Image_path": "-",
            "Expenses_type": this.expensestype[this._expensesReport.Expenses_type],
            "Amount": this._expensesReport.Amount
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
