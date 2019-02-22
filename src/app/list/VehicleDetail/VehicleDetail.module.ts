import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { VehicleDetailRoutingModule } from "./VehicleDetail-routing.module";
import { VehicleDetailComponent } from "./VehicleDetail.component";

@NgModule({
    imports: [
        NativeScriptModule,
        VehicleDetailRoutingModule
    ],
    declarations: [
        VehicleDetailComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class VehicleDetailModule { }
