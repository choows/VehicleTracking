import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { UserProfileRoutingModule } from "./user_profile-routing.module";
import { UserProfileComponent } from "./user_profile.component";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
@NgModule({
    imports: [
        NativeScriptCommonModule,
        UserProfileRoutingModule,
        NativeScriptUIListViewModule,
        NativeScriptFormsModule,
    ],
    declarations: [
        UserProfileComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class BrowseModule { }
