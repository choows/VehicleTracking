import { NgModule, NgModuleFactoryLoader, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { DisplayReportComponent } from "./display_report/display_report.component";
import { ListComponent } from "./list/list.component";
import { NewVehicleComponent } from "./new_vehicle/new_vehicle.component";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { ReportsRefuelComponent } from "./reports/report.refuel/report.refuel.component";
import { ReportsExpensesComponent } from "./reports/reports.expenses/reports.expenses.component";
import { ReportsInsuranceComponent } from "./reports/reports.insurance/reports.insurance.component";
import { ReportsReminderComponent } from "./reports/reports.reminder/reports.reminder.component";
import { ReportsServiceComponent } from "./reports/reports.service/reports.service.component";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./Login/Login.component";
import * as platform from "platform";
import { TNSCheckBoxModule } from 'nativescript-checkbox/angular';
import { UserService } from "./shared/user.service";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular";
import { StatisticsComponent } from "./Statistics/Statistics.component";
import { NativeScriptUIChartModule } from "nativescript-ui-chart/angular";
import { MasterBranchViewComponent } from "./Master-Branch-View/Master-Branch-View.component";
import { ViewQrCodeComponent } from "./ViewQRCode/ViewQRCode.component";
import { BarcodeScanner } from 'nativescript-barcodescanner';
import { BranchViewVehicleComponent } from "./Master-Branch-View/Branch_View_Vehicle/Branch_View_Vehicle.component";
import { DateTimePickerModelComponent } from "../app/reports/DateTimePickerModel/DateTimePickerModel.component";

declare var GMSServices: any;
if (platform.isIOS) {
    GMSServices.provideAPIKey("AIzaSyDRfjOnHTI8ztt1MZ6PmI5PqiE1LJ2QjUA");
}
@NgModule({
    bootstrap: [
        AppComponent,
    ],
    imports: [
        AppRoutingModule,
        NativeScriptUIChartModule,
        NativeScriptModule,
        NativeScriptUISideDrawerModule,
        NativeScriptFormsModule,
        TNSCheckBoxModule,
        NativeScriptUIListViewModule,
        NativeScriptUIDataFormModule
    ],
    declarations: [
        BranchViewVehicleComponent,
        LoginComponent,
        ViewQrCodeComponent,
        AppComponent,
        DisplayReportComponent,
        ListComponent,
        NewVehicleComponent,
        ReportsRefuelComponent,
        ReportsExpensesComponent,
        ReportsInsuranceComponent,
        ReportsReminderComponent,
        ReportsServiceComponent,
        StatisticsComponent,
        MasterBranchViewComponent,
        DateTimePickerModelComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        UserService,
        BarcodeScanner
    ],
    entryComponents : [
        DateTimePickerModelComponent
    ]
})
export class AppModule {
}
