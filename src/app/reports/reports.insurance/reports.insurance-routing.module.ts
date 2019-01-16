import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { ReportsInsuranceComponent } from "./reports.insurance.component";

const routes: Routes = [
    { path: "", component: ReportsInsuranceComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class ReportsInsuranceRoutingModule { }
