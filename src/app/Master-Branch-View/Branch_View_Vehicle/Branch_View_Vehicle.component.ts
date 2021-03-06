import { Component, OnInit} from "@angular/core";
import * as appSettings from "tns-core-modules/application-settings";
import * as app from "application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { RouterExtensions } from "nativescript-angular/router";
import {Color} from "color";
import {isIOS} from "platform"
import { isAndroid } from "tns-core-modules/ui/page/page";
import { BranchService } from "../../shared/branch.service";

@Component({
    selector: "BranchViewVehicle",
    moduleId: module.id,
    templateUrl: "./Branch_View_Vehicle.component.html"
})
export class BranchViewVehicleComponent implements OnInit {
    Name : string ; 
    data;
    constructor( private routerextension : RouterExtensions, private branchservice : BranchService) {
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/
    }

    ngOnInit(): void {
        this.Name = appSettings.getString("Branch_Name");
        this.fetchQuery();
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
    }
    fetchQuery() {
        this.data = null;
        this.branchservice.BranchVehicle(appSettings.getString("Branch_ID")).then((result)=>{
            this.data = result ;
        });
        
    }
    /**
     * 
     * called while item loading in list view 
     * 
     * used to chaned the background color of list view in iOS.
     */
    onItemLoading(args){
        if(isIOS){
            var newcolor = new Color(0, 0, 0, 0);
            args.ios.backgroundView.backgroundColor = newcolor.ios;
            args.object.ios.pullToRefreshView.backgroundColor = newcolor.ios; 
        }
 
    }

    /**
     * 
     * called while pulling the list view 
     * 
     * refresh the data.
     */
    onPullToRefreshInitiated(args) {
        this.fetchQuery();
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
     * side drawer
     */
    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    /**
     * 
     * tapped the cell 
     * 
     * allow viewing the data 
     */
    
    onItemTap(args) {
        appSettings.setString("plate_no", this.data[args.index].vehicle_plate_no);
        appSettings.setBoolean("Branch" , true);
        this.routerextension.navigate(["/list"],{
            transition: {
                name: "slideLeft",
                duration: 50,
                curve: "linear"
            }
        });
    
    }
    onNavBack() {
        this.routerextension.back();
    }
}
