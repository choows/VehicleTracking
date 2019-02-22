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
import { Color } from "color";
import { isIOS } from "platform"
import { CardView } from 'nativescript-cardview';
import { VehicleService } from "../shared/vehicle.service";
import { BranchService } from "../shared/branch.service";
import { VehicleDetailComponent } from "../list/VehicleDetail/VehicleDetail.component";
import { Vehicle } from "../dataform-service/vehicle";
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
    branch: boolean = false;  // to check whether is a branch view or not 
    constructor(private branchservice: BranchService, private vcRef: ViewContainerRef, private modal: ModalDialogService, private routerextension: RouterExtensions, private route: ActivatedRoute, private vehicleservice: VehicleService) { }
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
     * display the vehicle detail
     */
    showDetail() {
        const plate_no = appSettings.getString("plate_no");
        let vehicle: JSON;
        if (this.branch) {
            vehicle = this.branchservice.getVehicleDetail(plate_no);
        } else {
            vehicle = this.vehicleservice.getVehicleDetail(plate_no);
        }
        var refuel: number = 0;
        var Service: number = 0;
        var Insurance: number = 0;
        var Expenses: number = 0;
        
        if (typeof vehicle["Reports"]["Refuel"] !== "undefined") {
            refuel = vehicle["Reports"]["Refuel"]["Total_Amount"];
        }
        if (typeof vehicle["Reports"]["Service"]!== "undefined") {
            Service = vehicle["Reports"]["Service"]["Total_Amount"];
        }
        if (typeof vehicle["Reports"]["Insurance"] !== "undefined") {
            Insurance = vehicle["Reports"]["Insurance"]["Total_Amount"];
        }
        if (typeof vehicle["Reports"]["Expenses"] !== "undefined") {
            Expenses = vehicle["Reports"]["Expenses"]["Total_Amount"];
        }
        var Next_Service = {
            Date: "-",
            Odometer: "-"
        }
        if (typeof vehicle["Next_Service"] !== "undefined") {
            Next_Service = vehicle["Next_Service"]
        }
        let items = {
            "Plate_no": plate_no,
            "Image": vehicle["Image"],
            "Odometer": vehicle["current_Odo"],
            "Manufacturer": vehicle["manufacturer"],
            "Tank_Capacity": vehicle["tank_capacity"],
            "Type": vehicle["type"],
            "Next_Service_Date": Next_Service["Date"],
            "Next_Service_Odometer": Next_Service["Odometer"],
            "Refuel": refuel,
            "Service": Service,
            "Insurance": Insurance,
            "Expenses": Expenses,
        };
        let options = {
            context: items,
            fullscreen: false,
            viewContainerRef: this.vcRef,
            //animate : true
        };
        this.modal.showModal(VehicleDetailComponent, options).then(res => {
            console.log(res);
        });

    }
    /**
     * 
     * specifically for iOS 
     * to declare the background color of listview.
     */
    onItemLoading(args) {
        if (isIOS) {
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
        this.FetchReport();
    }

    /**
     * fetch the reports list from background 
     */
    FetchReport() {
        if (this.branch) {
            //fetch vehicle from branch data.  
            this.data = this.branchservice.BranchVehicleDetail(this.name);
        } else {
            this.data = this.vehicleservice.GetReport();
        }
    }

    /**
     * 
     * remove the vehicle list from service. 
     */
    RemoveReport(data) {
        dialogs.confirm({
            title: "Confirm to Delete ?",
            okButtonText: "Delete",
            cancelButtonText: "Cancel",
        }).then(result => {
            if (result && !this.branch) {
                this.data.splice(this.data.indexOf(data), 1);
                this.vehicleservice.Remove_Report(data);
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
        // this.data = this.userservice.ReportList(this.branch);
        this.FetchReport();
        let listview = args.object;
        if (isAndroid) {
            listview.notifyPullToRefreshFinished();
        } else {
            setTimeout(() => {
                listview.notifyPullToRefreshFinished();
            }, 1000);
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
