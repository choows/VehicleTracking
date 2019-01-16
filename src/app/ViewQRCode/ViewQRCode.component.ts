import { Component, OnInit } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/directives/dialogs";
/* ***********************************************************
* Before you can navigate to this page from your app, you need to reference this page's module in the
* global app router module. Add the following object to the global array of routes:
* { path: "ViewQRCode", loadChildren: "./ViewQRCode/ViewQRCode.module#ViewQrCodeModule" }
* Note that this simply points the path to the page module file. If you move the page, you need to update the route too.
*************************************************************/

@Component({
    selector: "ViewQrCode",
    moduleId: module.id,
    templateUrl: "./ViewQRCode.component.html"
})
export class ViewQrCodeComponent implements OnInit {
    image_src;
    constructor(private mParams: ModalDialogParams) {
        this.image_src = mParams.context.Image;
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/
    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
    }
    tapped(){
        this.mParams.closeCallback(()=>{
            return null;
        });
    }
}
