import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { DateTimePickerModelRoutingModule } from "./DateTimePickerModel-routing.module";
import { DateTimePickerModelComponent } from "./DateTimePickerModel.component";

@NgModule({
    imports: [
        NativeScriptModule,
        DateTimePickerModelRoutingModule
    ],
    declarations: [
        DateTimePickerModelComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class DateTimePickerModelModule { }
