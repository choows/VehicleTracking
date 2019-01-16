import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { ListRoutingModule } from "./list-routing.module";
import { ListComponent } from "./list.component";

@NgModule({
    imports: [
        NativeScriptModule,
        ListRoutingModule
    ],
    declarations: [
        ListComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class ListModule { }
