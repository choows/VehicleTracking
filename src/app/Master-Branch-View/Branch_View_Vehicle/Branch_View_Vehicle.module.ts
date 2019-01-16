import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { BranchViewVehicleRoutingModule } from "./Branch_View_Vehicle-routing.module";
import { BranchViewVehicleComponent } from "./Branch_View_Vehicle.component";

@NgModule({
    imports: [
        NativeScriptModule,
        BranchViewVehicleRoutingModule
    ],
    declarations: [
        BranchViewVehicleComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class BranchViewVehicleModule { }
