import { Component, OnInit } from "@angular/core";
import { UserService } from "../shared/user.service";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "application";
import { SummaryService } from "../shared/summary.service";
/* ***********************************************************
* Before you can navigate to this page from your app, you need to reference this page's module in the
* global app router module. Add the following object to the global array of routes:
* { path: "Statistics", loadChildren: "./Statistics/Statistics.module#StatisticsModule" }
* Note that this simply points the path to the page module file. If you move the page, you need to update the route too.
*************************************************************/

@Component({
    selector: "Statistics",
    moduleId: module.id,
    templateUrl: "./Statistics.component.html"
})
export class StatisticsComponent implements OnInit {
    constructor(private userservice: UserService, private summaryservice: SummaryService) {
    }
    List = [];
    chart_type;
    max;
    min;
    GraphList = [];
    onbusy;
    Fuel_Price = [] ; 
    ngOnInit(): void {
        this.onbusy = true;
        this.summaryservice.getvehicleJSON().then(()=>{
            this.List = this.summaryservice.return_cost_per_vehicle();
        }).then(()=>{
            this.GraphList = this.summaryservice.return_cost_per_day();
        }).then(()=>{
            this.Fuel_Price = this.summaryservice.return_Fuel_price_list();
        }).then(()=>{
            this.onbusy = false;
        });
       
        /*//
        this.onbusy = true;
        this.List = this.userservice.fetchStatistics();
        this.userservice.fetchGraphStatistics().then((result) => {
            this.GraphList = result["value"];
        }).then(() => {
            this.onbusy = false;
            this.ProgressArray();
        }).catch((err) => {
            console.log(err);
        });
        */
    }
    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
    IndexChanged(args) {
        switch (args.newIndex) {
            case 0: {
                this.chart_type = "Total Cost Per Vehicle";
                break;
            }
            case 1: {
                this.chart_type = "Cost per day";
                break;
            }
            case 2 : {
                this.chart_type = "Fuel Price";
                break;
            }
            default: break;
        }
    }
    ProgressArray() {
        /**
         * sort the date by using the totimestring( method )
         */
        this.GraphList.sort((s1, s2) => {
            let date1 = new Date(s1.Date);
            let date2 = new Date(s2.Date);
            if (date1.getTime() > date2.getTime()) {
                return 1;
            } else {
                if (date1.getTime() < date2.getTime()) {
                    return -1;
                } else {
                    return 0;
                }
            }
        });
        //combine all the similar 
        //if reduce , it produce a single number , not array ; 
        var arr = [];
        for (var i = 0; i < this.GraphList.length; i++) {

            if (i < this.GraphList.length - 1) {
                if (this.GraphList[i + 1].Date === this.GraphList[i].Date) {
                    this.GraphList[i + 1].Amount += this.GraphList[i].Amount;
                } else {
                    arr.push({ "Date": this.GraphList[i].Date, "Amount": this.GraphList[i].Amount });
                }
            } else {
                //for the last unit in the array.
                arr.push({ "Date": this.GraphList[i].Date, "Amount": this.GraphList[i].Amount });
            }
        }
        this.GraphList = arr;

        for (var item in this.GraphList) {
            let date = new Date(this.GraphList[item].Date);
            let convertin = date.getDate() + "/" + date.getUTCMonth(); + date.getFullYear();
            this.GraphList[item].Date = convertin;
            // this.GraphList[item].Date = date.getMilliseconds();
        }


        let current = new Date(Date.now());
        this.min = "1/" + current.getMonth().toString() + "/" + current.getFullYear().toString();
        let days = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
        this.max = days.toString() + "/" + current.getMonth().toString() + "/" + current.getFullYear().toString();

    }
}
