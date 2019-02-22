import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { VehicleDetailComponent } from "./VehicleDetail.component";

const routes: Routes = [
    { path: "", component: VehicleDetailComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class VehicleDetailRoutingModule { }
