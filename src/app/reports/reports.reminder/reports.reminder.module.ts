import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { ReportsReminderRoutingModule } from "./reports.reminder-routing.module";
import { ReportsReminderComponent } from "./reports.reminder.component";

@NgModule({
    imports: [
        NativeScriptModule,
        ReportsReminderRoutingModule,
        NativeScriptFormsModule,
    ],
    declarations: [
        ReportsReminderComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class ReportsReminderModule { }
