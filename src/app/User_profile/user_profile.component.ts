import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import * as app from "application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { UserService } from "../shared/user.service";
import { ScrollView, ScrollEventData } from 'tns-core-modules/ui/scroll-view';
import { View } from 'tns-core-modules/ui/core/view';
import * as imagepicker from "nativescript-imagepicker";
import { AppComponent } from "../app.component";
import { ImageSource } from "tns-core-modules/image-source/image-source";
import { knownFolders } from "tns-core-modules/file-system/file-system";
import { ProfileService } from "../shared/user_profile.service";
@Component({
    selector: "UserProfile",
    moduleId: module.id,
    templateUrl: "./user_profile.component.html"
})
export class UserProfileComponent implements OnInit {
    @ViewChild("secondTextFieldId") secondTextFieldId: ElementRef;

    User_Name: string = "Not Provided";
    User_Email: string = "Not Provided";
    Profile_image_url: string = "";
    busy: boolean = false;
    constructor(private userservice: UserService, private appcomponent: AppComponent, private profileservice: ProfileService) {
        // Use the component constructor to inject providers.
    }
    TotalNumberOfVehicleOwned = 0;
    TotalNumberOfReports = 0;
    TotalCost = 0;
    Most_frequent_vehicle = "-";
    highet_spending = 0;
    TotalNumberOfBranch = 0;
    ngOnInit(): void {
        this.profileservice.GetUserDetail().then((result) => {
            this.User_Name = result["name"];
            this.User_Email = result["email"];
            this.Profile_image_url = result["profileImageURL"];
        }).catch((error) => {
            console.log(error);
        });
        
        this.profileservice.getSummary().then((result) => {
            this.TotalNumberOfVehicleOwned = result["Total_Number_of_Vehicle"];
            this.TotalNumberOfReports = result["Total_Number_of_Reports"];
            this.TotalCost = result["Total_Reports_Cost"];
            this.Most_frequent_vehicle = result["Most_Frequent_Vehicle"];
            this.highet_spending = result["Highest_Cost"];
        }).then(() => {
            this.profileservice.getNumberOfBranch().then((result : number)=>{
                this.TotalNumberOfBranch = result ; 
            });
        })

    }
    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
    onScroll(event: ScrollEventData, scrollView: ScrollView, topView: View) {
        if (scrollView.verticalOffset < 250) {
            const offset = scrollView.verticalOffset / 2;
            if (scrollView.ios) {
                topView.animate({ translate: { x: 0, y: offset } }).then(() => { }, () => { });
            } else {
                topView.translateY = Math.floor(offset);
            }
        }
    }
    edit: boolean = false;
    temp_name;
    temp_image;
    onEdit() {
        this.edit = true;
        this.temp_name = this.User_Name;
        this.temp_image = this.Profile_image_url;
    }
    onDone() {
        this.edit = false;
        this.profileservice.UpdateProfile(this.User_Name, this.Profile_image_url);
        this.appcomponent.RefreshProfile();

    }
    onCancel() {
        this.edit = false;
        this.User_Name = this.temp_name;
        this.Profile_image_url = this.temp_image;
    }
    uploadImage() {
        if (this.edit) {
            this.busy = true;
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
                    this.Profile_image_url = file.path;
                    this.busy = false;
                }).catch(function (e) {
                    console.log(e);
                });
        }
    }

    
}
