import { Component, OnInit } from "@angular/core";
import { TimePicker } from "tns-core-modules/ui/time-picker/time-picker";
import { DatePicker } from "tns-core-modules/ui/date-picker";
import { ModalDialogParams } from "nativescript-angular/directives/dialogs";

/* ***********************************************************
* Before you can navigate to this page from your app, you need to reference this page's module in the
* global app router module. Add the following object to the global array of routes:
* { path: "DateTimePickerModel", loadChildren: "./DateTimePickerModel/DateTimePickerModel.module#DateTimePickerModelModule" }
* Note that this simply points the path to the page module file. If you move the page, you need to update the route too.
*************************************************************/

@Component({
    selector: "DateTimePickerModel",
    moduleId: module.id,
    templateUrl: "./DateTimePickerModel.component.html"
})
export class DateTimePickerModelComponent implements OnInit {
    date : Date = new Date(Date.now());
    private isDate : boolean = false;
    private isTime : boolean = false;

    constructor(private mParams: ModalDialogParams) {
        this.isDate = mParams.context.isDate;
        this.isTime = mParams.context.isTime;
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/
    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
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
    //for time picker usage
    onTimeChanged(args) {
        let timePicker = <TimePicker>args.object;
        this.date.setHours(timePicker.hour);
        this.date.setMinutes(timePicker.minute);
    }
    onDone(){
        if(this.isDate){
            this.mParams.closeCallback(this.date.toDateString());
        }else{
            this.mParams.closeCallback(this.date.toLocaleTimeString().slice(0, 9));
        }
    }
}
