import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { MasterBranchViewComponent } from "./Master-Branch-View.component";

const routes: Routes = [
    { path: "", component: MasterBranchViewComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class MasterBranchViewRoutingModule { }
