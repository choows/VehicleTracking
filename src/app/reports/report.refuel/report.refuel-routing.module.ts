import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { ReportsRefuelComponent } from "./report.refuel.component";

const routes: Routes = [
    { path: "", component: ReportsRefuelComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class ReportRefuelRoutingModule { }
