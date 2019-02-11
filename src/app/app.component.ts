import { Component, OnInit, ViewChild } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import * as app from "application";
import { RouterExtensions } from "nativescript-angular/router";
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import { filter } from "rxjs/operators";
import { BackendService } from "./shared/backend.service";
import { UserService } from "./shared/user.service";
import * as appSettings from "tns-core-modules/application-settings";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { initializeOnAngular } from "nativescript-web-image-cache";
import { connectionType, getConnectionType } from "tns-core-modules/connectivity/connectivity";
import { ProfileService } from "../app/shared/user_profile.service";
@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
    /**
     * declare the global variable.
     */
    private _activatedUrl: string;
    private _sideDrawerTransition: DrawerTransitionBase;
    UserName: string = "";
    PhotoUrl: string = "https://firebasestorage.googleapis.com/v0/b/finalyearproject-ed21e.appspot.com/o/sample_image%2Fdownload.jpg?alt=media&token=d1436475-5593-4b93-adaa-d79c13689e87";
    email: string = "";

    constructor(private profileservice: ProfileService, private router: Router, private routerExtensions: RouterExtensions, private userservice: UserService) {
        initializeOnAngular();
    }

    /**
     * calling the sidedrawer component. 
     * 
     * modify the sidedrawer component. 
     */

    @ViewChild("sidedrawer") sidedrawer: RadSideDrawer;
    enableGesture() {
        this.sidedrawer.gesturesEnabled = true;
    }
    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
    RefreshProfile() {
        //to refresh the heading image and detail in the side drawer. 
        this.profileservice.GetUserDetail().then((result) => {
            this.UserName = result["name"];
            this.email = result["email"];
            this.PhotoUrl = result["profileImageURL"];
        }).catch((error) => {
            console.log("error");
        });
    }



    /**
     * initialize the component 
     */
    ngOnInit(): void {
        BackendService.setup()
        this._sideDrawerTransition = new SlideInOnTopTransition();
        this.router.events
            .pipe(filter((event: any) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => this._activatedUrl = event.urlAfterRedirects);
        if (appSettings.hasKey("user_id")) {
            this.RefreshProfile();
        }
    }


    /**
     * 
     * 
     * below is the sidedrawer function. 
     * 
     * 
     */
    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    isComponentSelected(url: string): boolean {
        return this._activatedUrl === url;
    }

    onNavItemTap(navItemRoute: string): void {
        this.routerExtensions.navigate([navItemRoute], {
            transition: {
                name: "fade"
            },
            clearHistory: true
        });

        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }
    onLogout() {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        if (getConnectionType() != connectionType.none) {
            dialogs.confirm({
                message: "Are you sure you want to Logout?",
                okButtonText: "Yes",
                cancelButtonText: "No"
            }).then((result) => {
                if (result) {
                    this.userservice.logout().then(() => {
                        sideDrawer.gesturesEnabled = false;
                        sideDrawer.closeDrawer();
                        this.routerExtensions.navigate(["/login"], { clearHistory: true });
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            }).catch((err) => {
                console.log(err);
            });
        } else {
            alert("You Are not allowed to Logout in Offline Mode.");
        }

    }

}
