import { Component, OnInit } from "@angular/core";
import * as app from "application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { RouterExtensions } from "nativescript-angular/router";
import * as appSettings from "tns-core-modules/application-settings";
import { UserService } from "../shared/user.service";
import { isAndroid } from 'tns-core-modules/ui/core/view';
import { AppComponent } from "../app.component";
import { ListViewEventData } from "nativescript-ui-listview";
import { screen } from "tns-core-modules/platform/platform";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { Color } from "color";
import { isIOS } from "platform"
import { VehicleService } from "../shared/vehicle.service";
import { BranchService } from "../shared/branch.service";
@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})

export class HomeComponent implements OnInit {
    isBusy: boolean = false;
    allowed = true;
    data = [];
    constructor(private branchserviec : BranchService,private appcomponent: AppComponent, private routerextension: RouterExtensions, private userservice: UserService, private vehicleservice: VehicleService) { }
    /**
     * adding new vehicle function. 
     * redirect to the new_vehicle component.
     */
    add() {
        this.routerextension.navigate(["/new_vehicle"]);
    }


    /**
     * 
     * redirect into the detail of that vehicle. 
     * @param args 
     */
    onItemTap(args) {
        appSettings.setString("plate_no", this.data[args.index].vehicle_plate_no);

        appSettings.setNumber("Odo", this.data[args.index].current_odo);

        this.routerextension.navigate(["/list"], {
            transition: {
                name: "slideLeft",
                duration: 100,
                curve: "linear"
            }
        });
    }


    /**
     * tap out the sidedrawer and close. 
     */
    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    /**
     * call in initialize 
     * 
     * remove the certain cache 
     * enable the sidedrawer gesture
     * refresh teh profile in sidedrawer. 
     * fetch the data from service. 
     */
    ngOnInit() {
        appSettings.remove("plate_no");
        appSettings.remove("Branch");
        appSettings.remove("Odo");
        this.userservice.GetUserDetail().then((result) => {
        });
        this.appcomponent.enableGesture();
        this.appcomponent.RefreshProfile();
        this.fetchQuery();
    }
    fetchQuery() {
        this.data = [];
        this.vehicleservice.GetVehicle().then((result: []) => {
            this.data = result;
        }).then(()=>{
            this.branchserviec.FetchBranch();
        })
    }

    /**
     * 
     * called while pull the list view 
     * item refreshed 
     * set time out is needed in the ios platform to enable the icon to pull back. 
     */
    onPullToRefreshInitiated(args) {

        this.fetchQuery();
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
     * 
     * called while the cell swipe started. 
     */
    onSwipeCellStarted(args: ListViewEventData) {
        const swipeLimits = args.data.swipeLimits;
        const swipeView = args['object'];
        swipeLimits.right = screen.mainScreen.widthPixels;
        swipeLimits.left = 0;
        this.allowed = true;
    }
    onCellSwiping(args) {
        let width = screen.mainScreen.widthPixels;
        if (args.data.x == -width && this.allowed) {
            dialogs.confirm("Comfirm to Delete ?").then((res) => {
                if (res) {
                    this.deleteitem(this.data[args.index]);
                } else {
                    //restore the listview..
                    let listview = args.object;
                    listview.notifySwipeToExecuteFinished();
                }
            }).catch((err) => {
                console.log(err);
            });
            this.allowed = false;
        }
    }
    /**
     * 
     * delete the call and delete the vehicle from service. 
     */
    deleteitem(args) {
        let path: string = "Users/" + appSettings.getString("user_id");
        this.vehicleservice.RemoveVehicle(args);
        this.data.splice(this.data.indexOf(args), 1);
    }
    /**
     * 
     * specially for iOS
     * used to declare the backround color in iOS since declaration is not function in css 
     */
    onItemLoading(args) {
        if (isIOS) {
            var newcolor = new Color(0, 0, 0, 0);
            args.ios.backgroundView.backgroundColor = newcolor.ios;
            args.object.ios.pullToRefreshView.backgroundColor = newcolor.ios;
        }

    }
}
