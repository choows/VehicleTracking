import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { ViewQrCodeComponent } from "./ViewQRCode.component";

const routes: Routes = [
    { path: "", component: ViewQrCodeComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class ViewQrCodeRoutingModule { }
