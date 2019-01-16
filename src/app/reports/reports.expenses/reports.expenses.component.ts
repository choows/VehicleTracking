import { Component, OnInit,ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import * as applicationModule from "tns-core-modules/application";
import { RouterExtensions } from "nativescript-angular/router";
import * as geoLocation from "nativescript-geolocation";
import * as camera from "nativescript-camera";
import { ImageSource} from "tns-core-modules/image-source/image-source";
import { knownFolders } from "tns-core-modules/file-system/file-system";
import { Image } from "ui/image";
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';
import { TimePicker } from "tns-core-modules/ui/time-picker/time-picker";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import * as appSettings from "tns-core-modules/application-settings";
import { UserService } from "../../shared/user.service";
import { DatePicker } from "tns-core-modules/ui/date-picker";
import * as imagepicker from "nativescript-imagepicker";
import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import { DateTimePickerModelComponent } from "../DateTimePickerModel/DateTimePickerModel.component";
@Component({
    selector: "ReportsExpenses",
    moduleId: module.id,
    templateUrl: "./reports.expenses.component.html",
})
export class ReportsExpensesComponent implements OnInit {
    onbusy : boolean = false;
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
    DateStr : string ;
    TimeStr : string;
    ngOnInit() { 
        const current_date = new Date(Date.now());
        this.DateStr = current_date.toDateString();
        this.TimeStr = current_date.toLocaleTimeString().slice(0, 9);
    }
    constructor(private vcRef: ViewContainerRef, private modal: ModalDialogService, private routerextension: RouterExtensions, private userservice: UserService) { }
    onNavBack() {
        this.routerextension.back();
    }


    //picker
    selectedtype(args) {
        let picker = <ListPicker>args.object;
        this.pickedexpensestype = this.expensestype[picker.selectedIndex];
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
        console.log(arg);
        this.date.setMonth(arg.value);
    }
    onYearChanged(arg) {
        this.date.setFullYear(arg.value);
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
    validation(){
        let checker: boolean = true;
        let error: string = "";
        if(this.Odometer == null){
            this.Odometer = this.odo_hint +1 ;
        }
        if (this.expensesAmount == null) {
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
    submit() {
        this.onbusy = true;
        let path: string = "Users/" + appSettings.getString("user_id") + "/" + appSettings.getString("vehicle_key") + "/Expenses";
        let data = {
            "Report_type": "Expenses",
            "Date": this.DateStr,
            "Time": this.TimeStr,
            "Location": {
                "latitude": this.latitude,
                "longitude": this.longitude
            },
            "Odometer": parseInt(this.Odometer.toString()),
            "Note": this.note,
            "Image": this.image,
            "Image_path" : "-",
            "Expenses_type": this.pickedexpensestype,
            "Amount": parseFloat(this.expensesAmount)
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
