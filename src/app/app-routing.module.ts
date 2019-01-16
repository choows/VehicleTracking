import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { DisplayReportComponent } from "./display_report/display_report.component";
import { ListComponent } from "./list/list.component";
import { NewVehicleComponent } from "./new_vehicle/new_vehicle.component";
import { ReportsRefuelComponent } from "./reports/report.refuel/report.refuel.component";
import { ReportsExpensesComponent } from "./reports/reports.expenses/reports.expenses.component";
import { ReportsInsuranceComponent } from "./reports/reports.insurance/reports.insurance.component";
import { ReportsReminderComponent } from "./reports/reports.reminder/reports.reminder.component";
import { ReportsServiceComponent } from "./reports/reports.service/reports.service.component";
import { LoginComponent } from "./Login/Login.component";
import { StatisticsComponent } from "./Statistics/Statistics.component";
import { MasterBranchViewComponent } from "./Master-Branch-View/Master-Branch-View.component";
import { ViewQrCodeComponent } from "./ViewQRCode/ViewQRCode.component";
import { BranchViewVehicleComponent } from "./Master-Branch-View/Branch_View_Vehicle/Branch_View_Vehicle.component";

const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: "home", loadChildren: "~/app/home/home.module#HomeModule" },
    { path: "user_profile", loadChildren: "~/app/User_profile/user_profile.module#BrowseModule" },
    { path: "display_report", component: DisplayReportComponent },
    { path: "list", component: ListComponent },
    { path: "new_vehicle", component: NewVehicleComponent },
    { path: "reports/refuel", component: ReportsRefuelComponent },
    { path: "reports/expenses", component: ReportsExpensesComponent },
    { path: "reports/insurance", component: ReportsInsuranceComponent },
    { path: "reports/reminder", component: ReportsReminderComponent },
    { path: "reports/service", component: ReportsServiceComponent },
    { path: "statistics", component: StatisticsComponent },
    { path: "master-branch", component: MasterBranchViewComponent },
    { path: "viewQR", component: ViewQrCodeComponent },
    { path: "View-Vehicle", component: BranchViewVehicleComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
