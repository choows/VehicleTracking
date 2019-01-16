import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { ReportRefuelRoutingModule } from "./report.refuel-routing.module";
import { ReportsRefuelComponent } from "./report.refuel.component";
@NgModule({
    imports: [
        NativeScriptModule,
        ReportRefuelRoutingModule,
        NativeScriptFormsModule,
    ],
    declarations: [
        ReportsRefuelComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class ReportRefuelModule { }
