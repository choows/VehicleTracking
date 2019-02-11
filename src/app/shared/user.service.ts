/**
 * this file contain the functions which is mainly used in background for example like :
 * 
 * fetch data from firebase 
 * read data from firebase 
 * read file , write file 
 * and others as describe in below. 
 */

import { Injectable } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";
import * as appSettings from "tns-core-modules/application-settings";
import { knownFolders, File } from "tns-core-modules/file-system";
import { connectionType, getConnectionType } from "tns-core-modules/connectivity";
import * as dialogs from "tns-core-modules/ui/dialogs";
@Injectable()
export class UserService {
    private Data;
    private BranchUserList = [];
    /**
     * registration 
     */
    Register(email: string, password: string) {
        return new Promise((resolve, reject) => {
            firebase.createUser({
                email: email,
                password: password,
            }).then(() => {
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    }
    /**
     * login
     */
    login(username: string, password: string) {
        return new Promise((resolve, reject) => {
            firebase.login({ type: firebase.LoginType.PASSWORD, email: username, password: password }).then(() => {
                resolve();
            }).catch((error) => {
                reject();
                let err: string = error.toString();
                let result = err.split("Exception: ")[1];
                alert(result);
            });
        });
    }
    /**
     * set the push token for firebase 
     * 
     * used for notiufication purpose. 
     */
    SetToken() {
        const path = "Users/" + appSettings.getString("user_id") + "/Token";
        firebase.getCurrentPushToken().then((result) => {
            firebase.setValue(path, result).catch((err) => {
                console.log(err);
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    
    /**
     * 
     * upload the image to the firebase storage and return the link of upload and the download url. 
     */
    uploadImage(image_path) {
        return new Promise((resolve, reject) => {
            if (image_path == null) {
                let result = {
                    link: "https://firebasestorage.googleapis.com/v0/b/backupfirebaseproject.appspot.com/o/sample%2Fno%20image.png?alt=media&token=14554fd3-1c8d-4b78-bf0e-431b075ed11c",
                    image_path: "-"
                };
                resolve(result);
            } else {
                let path = "uploads/" + appSettings.getString("user_id") + "/" + Date.now().toString();
                let file: File;
                file = File.fromPath(image_path);

                firebase.storage.uploadFile(
                    {
                        remoteFullPath: path,
                        localFile: file,
                        onProgress: (data) => { }
                    }
                ).then(() => {
                    firebase.storage.getDownloadUrl({ remoteFullPath: path }).then((result) => {
                        resolve({
                            link: result,
                            image_path: path
                        });
                    });
                }).catch((error) => {
                    console.log(error);
                    reject();
                })
            }
        });
    }

    /**
     * logout from firebase 
     */
    logout() {
        return new Promise((resolve, reject) => {
            firebase.logout().then(() => {
                appSettings.flush();
                appSettings.clear();
                this.Data = null;
                resolve();
            }).catch((error) => {
                console.log(error);
                reject();
            });
        });
    }


    /**
     * 
     * allow user to reset the password using email. 
     */
    ForgotPassword(email: string) {
        return new Promise((resolve, reject) => {
            firebase.resetPassword({
                email: email
            }).then((result) => {
                resolve();
            }).catch((error) => {
                reject();
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    /**
     * return the statistics data
     */
    fetchStatistics() {
        var return_list = [];
        for (var item in this.Data) {
            const Data = this.Data;
            if (item != "Summary" && typeof Data[item]["Total"] !== "undefined") {

                return_list.push({ "Plate_no": Data[item]["plate_no"], "Total_cost": Data[item]["Total"]["Total_Cost"] });
            }
        }
        return return_list;
    }

    fetchGraphStatistics() {
        /**
         * the fetching shoule be only 3 month to prevent the phone from bursting.
         *
         * this function must be done in background and using the loading symbol.
         * first : seperate all the report out
         */

        const result = this.Data;
        var list = [];
        return new Promise((resolve, reject) => {
            for (var vehicles in result) {
                if (typeof result[vehicles]["type"] !== "undefined") {
                    const vehicle = result[vehicles];
                    for (var reports in vehicle) {
                        if (typeof vehicle[reports]["Total_Amount"] !== "undefined") {
                            const report = vehicle[reports];
                            for (var detail_report in report) {
                                if (typeof report[detail_report]["Amount"] !== "undefined") {
                                    list.push({ "Date": report[detail_report]["Date"], "Amount": report[detail_report]["Amount"] });
                                }
                            }
                        }
                    }
                }
            }
            resolve({ "value": list });
        })
            .catch((err) => {
                console.log(err);
            });
    }
    NxtService(nxt){
        let path: string = "Users/" + appSettings.getString("user_id") + "/" + appSettings.getString("vehicle_key") + "/Next_Service";
        firebase.setValue(path , nxt).catch((err)=>{
            console.log(err);
        });
    }
}
//