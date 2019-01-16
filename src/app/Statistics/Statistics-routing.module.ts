import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { StatisticsComponent } from "./Statistics.component";

const routes: Routes = [
    { path: "", component: StatisticsComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class StatisticsRoutingModule { }
