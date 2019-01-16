import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { ReportsInsuranceRoutingModule } from "./reports.insurance-routing.module";
import { ReportsInsuranceComponent } from "./reports.insurance.component";

@NgModule({
    imports: [
        NativeScriptModule,
        ReportsInsuranceRoutingModule,
        NativeScriptFormsModule,
    ],
    declarations: [
        ReportsInsuranceComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class ReportsInsuranceModule { }
