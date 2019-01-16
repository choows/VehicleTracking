import { Component, OnInit, ElementRef, ViewChild, ViewContainerRef } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";
import * as appSettings from "tns-core-modules/application-settings";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "application";
import { UserService } from "../shared/user.service";
import { isAndroid } from 'tns-core-modules/ui/core/view';
import { registerElement } from "nativescript-angular/element-registry";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import { DisplayReportComponent } from "../display_report/display_report.component";
import {Color} from "color";
import {isIOS} from "platform"
import { CardView } from 'nativescript-cardview';
registerElement('CardView', () => CardView);
registerElement("Fab", () => require("nativescript-floatingactionbutton").Fab);

@Component({
    selector: "List",
    moduleId: module.id,
    templateUrl: "./list.component.html"
})
export class ListComponent implements OnInit {
    data = [];
    name = "";
    slide_out: boolean = true;  //to check the float action button whether slided out or not. 
    branch :boolean = false ;  // to check whether is a branch view or not 
    constructor(private vcRef: ViewContainerRef, private modal: ModalDialogService, private routerextension: RouterExtensions, private route: ActivatedRoute, private userservice: UserService) {}
    /**
     * allow the user to navigate back 
     */
    onNavBack() {
        this.routerextension.back();
    }
    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
    /**
     * 
     * specifically for iOS 
     * to declare the background color of listview.
     */
    onItemLoading(args){
        if(isIOS){
            var newcolor = new Color(0, 0, 0, 0);
            args.ios.backgroundView.backgroundColor = newcolor.ios;
            args.object.ios.pullToRefreshView.backgroundColor = newcolor.ios; 
        }
 
    }
    /**
     * called in initialization.
     */
    ngOnInit() {
        this.branch = appSettings.getBoolean("Branch");
        this.name = appSettings.getString("plate_no");
        this.data = this.userservice.ReportList(this.branch);
    }

    /**
     * 
     * remove the vehicle list from service. 
     */
    RemoveReport(data) {
        let path: string = "Users/" + appSettings.getString("user_id") + "/" + appSettings.getString("vehicle_key");
        console.log("user id : " + appSettings.getString("user_id"));
        console.log("vehicle id : " + appSettings.getString("vehicle_key"));
        dialogs.confirm({
            title: "Confirm to Delete ?",
            okButtonText: "Delete",
            cancelButtonText: "Cancel",
        }).then(result => {
            if (result) {
                this.userservice.Remove_Report(path, data);
                this.data.splice(this.data.indexOf(data), 1);
            }
        });
    }
    /**
     * 
     * called while long press the cell
     *  to allow user to pick their action.
     */
    onLongPress(args) {
        dialogs.action({
            message: "Please select your action",
            cancelButtonText: "Cancel",
            actions: ["View", "Delete"]
        }).then(result => {
            if (result == "Delete") {
                this.RemoveReport(args.object.bindingContext);
            } else if (result == "View") {
                this.viewDetail(args.object.bindingContext);
            }
        });
    }

    /**
     * 
     * allow the user to view the certain report.
     * passing the data into a modal popout. 
     */
    private viewDetail(data) {
        let data_tapped: any = data;
        let items = {
            "report_type": data_tapped.report_type,
            "date": data_tapped.Date,
            "time": data_tapped.Time,
            "fuel_type": data_tapped.Fuel_Type,
            "amount_paid": data_tapped.Amount_Paid,
            "fuel_price": data_tapped.Fuel_Price,
            "total_volume": data_tapped.Total_Volume,
            "location": data_tapped.Location,
            "odometer": data_tapped.Odometer,
            "note": data_tapped.Note,
            "photo": data_tapped.Photo,
            "parts": data_tapped.Parts,
            "expenses_type": data_tapped.Expenses_type,
            "insurance_type": data_tapped.Insurance_type,
            "insurance_company": data_tapped.Insurance_Company,
            "remind_before": data_tapped.RemindBefore,
        };
        let options = {
            context: items,
            fullscreen: true,
            viewContainerRef: this.vcRef,
            //animate : true
        };
        this.modal.showModal(DisplayReportComponent, options).then(res => {
            console.log(res);
        });
    }
    onItemTap(args) {
        this.viewDetail(args.object.bindingContext);
    }
    /**
     * 
     * called while pulling the cell 
     * refresh the data. 
     */
    onPullToRefreshInitiated(args) {
        this.data = null;
        this.data = this.userservice.ReportList(this.branch);
        let listview = args.object;
        if(isAndroid){
            listview.notifyPullToRefreshFinished();
        }else{
            setTimeout(()=>{
                listview.notifyPullToRefreshFinished();
            } , 1000);
        }
    }
    
    /**
     * below are all the navigation function and animation function for float action button. 
     */
    toRefuel() {
        if (this.slide_out) {
            this.animation();
        } else {
            this.animation();
            this.routerextension.navigate(["/reports/refuel"], {
                transition: {
                    name: "slideLeft",
                    duration: 50,
                    curve: "linear"
                }
            });
        }
    }
    toService() {
        if (this.slide_out) {
            this.animation();
        } else {
            this.animation();
            this.routerextension.navigate(["/reports/service"], {
                transition: {
                    name: "slideLeft",
                    duration: 50,
                    curve: "linear"
                }
            });
        }
    }
    toInsurance() {
        if (this.slide_out) {
            this.animation();
        } else {
            this.animation();
            this.routerextension.navigate(["/reports/insurance"], {
                transition: {
                    name: "slideLeft",
                    duration: 50,
                    curve: "linear"
                }
            });
        }
    }
    toReminder() {
        if (this.slide_out) {
            this.animation();
        } else {
            this.animation();
            this.routerextension.navigate(["/reports/reminder"], {
                transition: {
                    name: "slideLeft",
                    duration: 50,
                    curve: "linear"
                }
            });
        }
    }
    toExpenses() {
        if (this.slide_out) {
            this.animation();
        } else {
            this.routerextension.navigate(["/reports/expenses"], {
                transition: {
                    name: "slideLeft",
                    duration: 50,
                    curve: "linear"
                }
            });
        }
    }
    @ViewChild("mainFAB") MainFAB: ElementRef;
    @ViewChild("FAB1") RefuelFAB: ElementRef;
    @ViewChild("FAB2") ServiceFAB: ElementRef;
    @ViewChild("FAB3") InsuranceFAB: ElementRef;
    @ViewChild("FAB4") ExpensesFAB: ElementRef;
    @ViewChild("FAB5") ReminderFAB: ElementRef;
    animation() {
        if (!this.slide_out) {
            this.RefuelFAB.nativeElement.animate({
                duration: 200,
                opacity: 0,
                target: this.RefuelFAB.nativeElement,
                translate: { x: 0, y: 60 }
            });
            this.ServiceFAB.nativeElement.animate({
                duration: 200,
                opacity: 0,
                target: this.ServiceFAB.nativeElement,
                translate: { x: 0, y: 120 }
            });
            this.InsuranceFAB.nativeElement.animate({
                duration: 200,
                opacity: 0,
                target: this.InsuranceFAB.nativeElement,
                translate: { x: 40, y: 40 }
            });
            this.ExpensesFAB.nativeElement.animate({
                duration: 200,
                opacity: 0,
                target: this.ExpensesFAB.nativeElement,
                translate: { x: 120, y: 0 }
            });
            this.ReminderFAB.nativeElement.animate({
                duration: 200,
                opacity: 0,
                target: this.ReminderFAB.nativeElement,
                translate: { x: 60, y: 0 }
            });
            this.MainFAB.nativeElement.animate({
                duration: 200,
                rotate: 90
            });
            this.slide_out = true;

            //the main fab should rotate to form X
        } else {
            this.MainFAB.nativeElement.animate({
                duration: 200,
                rotate: -45
            });
            this.RefuelFAB.nativeElement.animate({
                duration: 200,
                opacity: 1,
                target: this.RefuelFAB.nativeElement,
                translate: { x: 0, y: -30 }
            });
            this.ServiceFAB.nativeElement.animate({
                duration: 200,
                opacity: 1,
                target: this.ServiceFAB.nativeElement,
                translate: { x: 0, y: -60 }
            });
            this.InsuranceFAB.nativeElement.animate({
                duration: 200,
                opacity: 1,
                target: this.InsuranceFAB.nativeElement,
                translate: { x: -40, y: -40 }
            });
            this.ExpensesFAB.nativeElement.animate({
                duration: 200,
                opacity: 1,
                target: this.ExpensesFAB.nativeElement,
                translate: { x: -60, y: 0 }
            });
            this.ReminderFAB.nativeElement.animate({
                duration: 200,
                opacity: 1,
                target: this.ReminderFAB.nativeElement,
                translate: { x: -30, y: 0 }
            });
            this.slide_out = false;
        }
    }
}
