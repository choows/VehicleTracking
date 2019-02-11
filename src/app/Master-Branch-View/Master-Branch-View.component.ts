import { Component, OnInit, ViewContainerRef } from "@angular/core";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as appSettings from "tns-core-modules/application-settings";
import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import { ViewQrCodeComponent } from "../ViewQRCode/ViewQRCode.component";
import { BarcodeScanner } from "nativescript-barcodescanner";
import { UserService } from "../shared/user.service";
import * as app from "application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { RouterExtensions } from "nativescript-angular/router";
import { Color } from "color";
import { screen } from "tns-core-modules/platform/platform";
import { isIOS } from "platform"
import { ListViewEventData } from "nativescript-ui-listview";
import { isAndroid } from "tns-core-modules/ui/page/page";
import { BranchService } from "../shared/branch.service";
@Component({
    selector: "MasterBranchView",
    moduleId: module.id,
    templateUrl: "./Master-Branch-View.component.html"
})
export class MasterBranchViewComponent implements OnInit {
    image_src;
    data = [];
    allowed = true;
    constructor(private routerextension: RouterExtensions,private branchservice : BranchService, private vcRef: ViewContainerRef, private modal: ModalDialogService, private userservice: UserService) { }
    available = false;
    ngOnInit() {
        appSettings.remove("plate_no");
        this.fetchQuery();
    }

    /**
     * fetch the data from service. 
     */
    fetchQuery() {
        this.data = null;
        this.data = this.branchservice.BranchesList();
        this.check();
    }

    /**
     * 
     * check whether data appear or not 
     */
    check() {
        if (this.data.length > 0) {
            this.available = true;
        } else {
            this.available = false;
        }
    }
    /**
     * 
     * called while item loading in list view 
     * 
     * used to chaned the background color of list view in iOS.
     */
    onItemLoading(args) {
        if (isIOS) {
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
        if (isAndroid) {
            listview.notifyPullToRefreshFinished();
        } else {
            setTimeout(() => {
                listview.notifyPullToRefreshFinished();
            }, 1000);
        }
    }

    /**
     * add the branch in either master or branch. 
     */
    add() {
        dialogs.action({
            message: "Select one of below to add.",
            cancelButtonText: "Cancel",
            actions: ["Master", "Branch"]
        }).then((result) => {
            if (result == "Master") {
                //at here do action to scan the qr code. 
                this.ScanQR();
            }
            if (result == "Branch") {
                this.ShowQR();
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    /**
     * allow the scanning of QR code. 
     */
    ScanQR() {
        let barcodescanner = new BarcodeScanner();
        barcodescanner.hasCameraPermission().then((permission) => {
            if (!permission) {
                barcodescanner.requestCameraPermission().then((result) => {
                    console.log(result);
                }).catch((err) => {
                    console.log(err);
                });
            }
        }).then(() => {
            barcodescanner.scan(
                {
                    formats: "QR_CODE",
                    showTorchButton: false,        // default false
                    beepOnScan: false,             // Play or Suppress beep on scan (default true)
                    closeCallback: () => { console.log("Scanner closed") }, // invoked when the scanner was closed (success or abort)
                    openSettingsIfPermissionWasPreviouslyDenied: true // On iOS you can send the user to the settings app if access was previously denied
                }).then((result) => {
                    //this will show out the user id of the master branch. 
                    this.OnAddMaster(result.text);
                }).catch((err) => {
                    console.log(err);
                });
        }).catch((err) => {
            console.log(err);
        })
    }

    /**
     * display the QR code with encryped user id 
     */
    ShowQR() {
        let id = appSettings.getString("user_id");
        var ZXing = require('nativescript-zxing');
        const zx = new ZXing();
        var img = zx.createBarcode({ encode: id, height: 100, width: 100, format: ZXing.QR_CODE });
        let options = {
            context: { "Image": img },
            fullscreen: false,
            viewContainerRef: this.vcRef,
            animate: true
        };
        this.modal.showModal(ViewQrCodeComponent, options).then(res => {
            //this.userservice.Refresh();
        });
    }

    /**
     * 
     * adding the master user id. 
     */
    OnAddMaster(master_id: string) {
        this.branchservice.AddMaster(master_id);
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
        //appSettings.setString("plate_no", this.data[args.index].vehicle_plate_no);
        // appSettings.setBoolean("Branch" , true);
        //  if (this.data[args.index].vehicle_key.length > 15) {
        //     appSettings.setString("vehicle_key", this.data[args.index].vehicle_key.toString());
        //  }
        //   var params:JSON = this.data[args.index].Data_Fetch;
        //   this.routerextension.navigate(["/list"],{
        //      transition: {
        //          name: "slideLeft",
        //          duration: 50,
        //          curve: "linear"
        //     },
        //       queryParams: {
        //          params
        //      }
        //   });
        if (appSettings.hasKey("Branch_Name")) {
            appSettings.remove("Branch_Name");
        }
        appSettings.setString("Branch_Name", this.data[args.index].user_name);
        appSettings.setString("Branch_ID", this.data[args.index].id);
        this.routerextension.navigate(["/View-Vehicle"], {
            transition: {
                name: "slideLeft",
                duration: 50,
                curve: "linear"
            }
        });
    }

    /**
     * 
     * called while the cell swipe started. 
     */
    onSwipeCellStarted(args: ListViewEventData) {
        const swipeLimits = args.data.swipeLimits;
        swipeLimits.right = screen.mainScreen.widthPixels;
        swipeLimits.left = 0;
        this.allowed = true;
    }
    onCellSwiping(args) {
        let width = screen.mainScreen.widthPixels;
        if (args.data.x == -width && this.allowed) {
            dialogs.confirm({
                title: "Confirm to remove " + this.data[args.index].name + " ? ",
                message: "This action could not be revert. ",
                okButtonText: "Delete",
                cancelButtonText: "Cancel",
            }).then((result) => {
                if (result) {
                    this.branchservice.removeBranch(this.data[args.index].id, this.data[args.index].name);
                    this.data.splice(this.data.indexOf(args), 1);
                } else {
                    //restore the listview..
                    let listview = args.object;
                    listview.notifySwipeToExecuteFinished();
                }
            }).catch((err) => {
                console.log(err);
            });
            this.allowed = false;
            this.check();
        }
    }
}
