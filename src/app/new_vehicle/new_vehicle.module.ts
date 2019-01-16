import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular";
import { NewVehicleRoutingModule } from "./new_vehicle-routing.module";
import { NewVehicleComponent } from "./new_vehicle.component";

@NgModule({
    imports: [
        NativeScriptModule,
        NewVehicleRoutingModule,
        NativeScriptFormsModule,
    ],
    declarations: [
        NewVehicleComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class NewVehicleModule { }
