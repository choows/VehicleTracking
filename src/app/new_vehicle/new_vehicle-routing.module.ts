import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { NewVehicleComponent } from "./new_vehicle.component";

const routes: Routes = [
    { path: "", component: NewVehicleComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class NewVehicleRoutingModule { }
