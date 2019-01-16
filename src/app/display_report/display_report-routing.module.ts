import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { DisplayReportComponent } from "./display_report.component";

const routes: Routes = [
    { path: "", component: DisplayReportComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class DisplayReportRoutingModule { }
