import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { DisplayReportRoutingModule } from "./display_report-routing.module";
import { DisplayReportComponent } from "./display_report.component";

@NgModule({
    imports: [
        NativeScriptModule,
        DisplayReportRoutingModule
    ],
    declarations: [
        DisplayReportComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class DisplayReportModule { }
