import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { DateTimePickerModelComponent } from "./DateTimePickerModel.component";

const routes: Routes = [
    { path: "", component: DateTimePickerModelComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class DateTimePickerModelRoutingModule { }
