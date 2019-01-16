import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { ReportsServiceRoutingModule } from "./reports.service-routing.module";
import { ReportsServiceComponent } from "./reports.service.component";
import { TNSCheckBoxModule } from 'nativescript-checkbox/angular';

@NgModule({
    imports: [
        NativeScriptModule,
        ReportsServiceRoutingModule,
        NativeScriptFormsModule,
        TNSCheckBoxModule
    ],
    declarations: [
        ReportsServiceComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class ReportsServiceModule { }
