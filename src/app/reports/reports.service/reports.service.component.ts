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
import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import { DateTimePickerModelComponent } from "../DateTimePickerModel/DateTimePickerModel.component";
@Component({
    selector: "ReportsService",
    moduleId: module.id,
    templateUrl: "./reports.service.component.html"
})

export class ReportsServiceComponent implements OnInit {

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
        this.date = new Date(Date.now());
        this.NextService_Odometer = this.odo_hint + 5000 ;
        const currentdate = new Date(Date.now());
        this.DateStr = currentdate.toDateString();
        this.TimeStr = currentdate.toLocaleTimeString().slice(0, 9)
    }
    constructor(private vcRef: ViewContainerRef, private modal: ModalDialogService,private routerextension: RouterExtensions, private userservice: UserService) { }
    onNavBack() {
        this.routerextension.back();
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

    //for Nxt service Date Picker
    NxtService : Date = new Date(Date.now());
    NxtonPickerLoaded(args) {
        let datePicker = <DatePicker>args.object;
        this.NxtService.setDate(datePicker.day);
        this.NxtService.setMonth(datePicker.month);
        this.NxtService.setFullYear(datePicker.year);
    }
    NxtonDayChanged(arg) {
        this.NxtService.setDate(arg.value);
    }
    NxtonMonthChanged(arg) {
        this.NxtService.setMonth(arg.value);
    }
    NxtonYearChanged(arg) {
        this.NxtService.setFullYear(arg.value);
    }

    //for time picker usage
    onTimeChanged(args) {
        let timePicker = <TimePicker>args.object;
        this.date.setHours(timePicker.hour);
        this.date.setMinutes(timePicker.minute);
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
        let checker: boolean = true;
        let error: string = "";
        if (this.Odometer == null) {
            this.Odometer = this.odo_hint + 1;
        }
        if (this.serviceAmount == null) {
            error += "\nPlease enter the Amount paid. ";
            checker = false;
        }
        //normal odometer with 6 digit , some got 7 digit
        if (this.Odometer > 9999999 || this.Odometer <= 0) {
            error += "\nPlease enter the correct odometer reading.(0000000 - 9999999) ";
            checker = false;
        }
        if (checker) {
            this.submit();
        } else {
            alert(error);
        }
    }
    //submit button
    submit() {
        this.onbusy = true;
        let current_date: string = this.date.toDateString();
        let path: string = "Users/" + appSettings.getString("user_id") + "/" + appSettings.getString("vehicle_key") + "/Service";
        let data = {
            "Report_type": "Service",
            "Date": current_date,
            "Time": this.date.toLocaleTimeString().slice(0, 9),
            "Location": {
                "latitude": this.latitude,
                "longitude": this.longitude
            },
            "Odometer": parseInt(this.Odometer.toString()),
            "Note": this.note,
            "Image": this.image,
            "Amount": parseFloat(this.serviceAmount),
            "Parts": this.data.toString(),
            "Image_path" : "-"
        };
        const nxt= {
            Date : this.NxtService.toDateString(),
            Odometer : this.NextService_Odometer,
        }
        this.userservice.NxtService(nxt);
        this.upload(path, data);
    }
    upload(path: string, data) {
        this.userservice.UploadData(path, data).then(() => {
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
