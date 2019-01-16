import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { MasterBranchViewRoutingModule } from "./Master-Branch-View-routing.module";
import { MasterBranchViewComponent } from "./Master-Branch-View.component";

@NgModule({
    imports: [
        NativeScriptModule,
        MasterBranchViewRoutingModule
    ],
    declarations: [
        MasterBranchViewComponent,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class MasterBranchViewModule { }
