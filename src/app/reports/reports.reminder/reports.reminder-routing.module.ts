import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { ReportsReminderComponent } from "./reports.reminder.component";

const routes: Routes = [
    { path: "", component: ReportsReminderComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class ReportsReminderRoutingModule { }
