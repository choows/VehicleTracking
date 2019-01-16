import { Component, OnInit} from "@angular/core";
import * as appSettings from "tns-core-modules/application-settings";
import { alert, prompt } from "tns-core-modules/ui/dialogs";
import { UserService } from "../shared/user.service";
import { RouterExtensions } from "nativescript-angular/router";
import { getConnectionType, connectionType } from "tns-core-modules/connectivity/connectivity";

@Component({
    selector: "Login",
    moduleId: module.id,
    templateUrl: "./Login.component.html"
})
export class LoginComponent implements OnInit {
    email: string;
    password: string;
    title: string = "Login";
    constructor( private routerextension: RouterExtensions, private userservice: UserService) {}
    ngOnInit(): void {
        if (appSettings.getString("user_id") != null) {
            this.directToHome();
        } else {
            appSettings.flush();
            appSettings.clear();
        }
    }
    IndexChanged(args) {
        if (args.newIndex == 0) {
            this.title = "Login";
        } else {
            this.title = "Register";
        }
    }
    directToHome() {
        this.routerextension.navigate(["/home"], {
            transition: {
                name: "slideLeft",
                duration: 50,
                curve: "linear"
            },
            clearHistory: true
        });
    }
    onSigninButtonTap(): void {
        const email = this.email;
        const password = this.password;
        if (email == null || password == null) {
            alert("Please enter the email and password correctly.");
        } else {
            if (getConnectionType() == connectionType.none) {
                alert("Network connection error.");
            } else {
                this.userservice.login(email, password).then(() => {
                    this.directToHome();
                });
            }
        }
    }

    onForgotPasswordTap(): void {
        prompt({
            title: "Forgot Password",
            message: "Enter the email address you used to register to reset your password.",
            defaultText: "",
            okButtonText: "Ok",
            cancelButtonText: "Cancel"
        }).then((data) => {
            if (data.result) {
                // Call the backend to reset the password
                this.userservice.ForgotPassword(data.text).then(() => {
                    alert({
                        message: "Your password was successfully reset. Please check your email for instructions on choosing a new password.",
                        okButtonText: "Ok"
                    })
                }).catch((error) => {
                    alert({
                        message: "Your password was unsuccessfully reset.",
                        okButtonText: "Ok"
                    });
                });
            }
        });
    }
    onSignupButtonTap(): void {
        const email = this.email;
        const password = this.password;
        this.userservice.Register(email, password).then(() => {
            alert("Successfully registered");
            this.routerextension.navigate(["/login"]);
        }).catch((error) => {
            console.log(error);
        });
    }
}
