import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { ReportsExpensesRoutingModule } from "./reports.expenses-routing.module";
import { ReportsExpensesComponent } from "./reports.expenses.component";

@NgModule({
    imports: [
        NativeScriptModule,
        ReportsExpensesRoutingModule,
        NativeScriptFormsModule
    ],
    declarations: [
        ReportsExpensesComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class ReportsExpensesModule { }
