import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { ReportsExpensesComponent } from "./reports.expenses.component";

const routes: Routes = [
    { path: "", component: ReportsExpensesComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class ReportsExpensesRoutingModule { }
