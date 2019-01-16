import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { ReportsServiceComponent } from "./reports.service.component";

const routes: Routes = [
    { path: "", component: ReportsServiceComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class ReportsServiceRoutingModule { }
