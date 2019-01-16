import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { ViewQrCodeRoutingModule } from "./ViewQRCode-routing.module";
import { ViewQrCodeComponent } from "./ViewQRCode.component";

@NgModule({
    imports: [
        NativeScriptModule,
        ViewQrCodeRoutingModule
    ],
    declarations: [
        ViewQrCodeComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class ViewQrCodeModule { }
