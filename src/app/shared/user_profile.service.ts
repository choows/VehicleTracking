/**
 * 
 * this service is fething the user profile 
 */

import { Injectable } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";
import * as appSettings from "tns-core-modules/application-settings";
import { knownFolders, File } from "tns-core-modules/file-system";
import { connectionType, getConnectionType } from "tns-core-modules/connectivity";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { UserService } from "../shared/user.service";
@Injectable()
export class ProfileService {



    /**
     * 
     * @param result 
     * writting the profile data into a file for offline mode. 
     */
    private writefile(result) {
        const file = knownFolders.temp().getFile("profile.json");
        file.writeText(JSON.stringify(result)).then((result) => {
        }).catch((err) => {
            console.log(err);
        });
    }

    /**
     * function read the vehicle list from the json file during offline mode. 
     */
    private readfile() {
        const file = knownFolders.temp().getFile("profile.json");
        return new Promise((resolve, reject) => {
            file.readText().then((result) => {
                resolve(JSON.parse(result));
            }).catch((err) => {
                reject(err);
            });
        });
    }


    /**
     * get User Profile Summary from firebase
     */
    private fetchSummary() {
        return new Promise((resolve, reject) => {
            const path = "Users/" + appSettings.getString("user_id") + "/Summary";
            firebase.getValue(path).then((result) => {
                resolve(result.value);
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    }

    /**
     * return summary of data 
     */
    getSummary() {
        return new Promise((resolve, reject) => {
            if (getConnectionType() != connectionType.none) {
                this.fetchSummary().then((result) => {
                    this.writefile(result);
                    resolve(result);
                });
            } else {
                this.readfile().then((result) => {
                    resolve(result);
                });
            }
        })
    }

    /**
     * return number of branch under the user. 
     */
    getNumberOfBranch() {
        let count = 0;
        return new Promise((resolve, reject) => {
            if (getConnectionType() != connectionType.none) {
                const path = "Users/" + appSettings.getString("user_id") + "/Branch";
                firebase.getValue(path).then((result) => {
                    const branches = result.value;
                    for (var branch in branches) {
                        count++;
                    }
                }).then(() => {
                    resolve(count);
                }).catch((err) => {
                    console.log(err);
                    reject(count);
                })
            } else {
                resolve(count);
            }

        })
    }
    /**
    * 
    * allow user to update the personal profile picture and display name. 
    */
    UpdateProfile(name: string, profilePicture: string) {
        if (profilePicture.includes("https")) {
            firebase.updateProfile({
                displayName: name,
                photoURL: profilePicture,
            }).catch((error) => {
                console.log(error);
            });
        } else {
            const userservice = new UserService() ; 
            userservice.uploadImage(profilePicture).then((result) => {
                firebase.updateProfile({
                    displayName: name,
                    photoURL: result["link"].toString()
                }).catch((error) => {
                    console.log(error);
                });
            }).catch((error) => {
                console.log(error);
            });
        }

        let user_profile = { "Username": name, "Profile_Pic": profilePicture };
        let path = "Users/" + appSettings.getString("user_id") + "/User_Profile";
        firebase.setValue(path, user_profile).then((res) => { }).catch((err) => { console.log(err) });
    }

    /**
     * return the user detail from firebase. 
     */
    GetUserDetail() {
        return new Promise((resolve, reject) => {
            firebase.getCurrentUser().then((result) => {
                if (result.name == null && result.profileImageURL == null) {
                    result.profileImageURL = "https://firebasestorage.googleapis.com/v0/b/backupfirebaseproject.appspot.com/o/sample%2Fno%20image.png?alt=media&token=14554fd3-1c8d-4b78-bf0e-431b075ed11c";
                    dialogs.prompt({
                        title: "Please Enter the Display Name",
                        okButtonText: "OK",
                        inputType: dialogs.inputType.text
                    }).then((r) => {
                        result.name = r.text;
                    }).then(() => {
                        this.UpdateProfile(result.name, result.profileImageURL);
                        resolve(result);
                    })
                } else {
                    resolve(result);
                }
            }).catch((error) => {
                reject(error);
            });
        }).catch((error) => {
            console.log(error);
        });
    }

}