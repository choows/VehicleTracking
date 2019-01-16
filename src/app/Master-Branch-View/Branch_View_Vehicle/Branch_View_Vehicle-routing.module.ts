import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { BranchViewVehicleComponent } from "./Branch_View_Vehicle.component";

const routes: Routes = [
    { path: "", component: BranchViewVehicleComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class BranchViewVehicleRoutingModule { }
