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
                this.FetchFirebase();
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
     * 
     * write and read the file which used to store the data into json format
     * the file is used for offline mode to allow the user to view in offline 
     */
    private writefile(result) {
        const file = knownFolders.temp().getFile("data.json");
        file.writeText(JSON.stringify(result)).then((result) => {
        }).catch((err) => {
            console.log(err);
        });
    }
    private readfile() {
        const file = knownFolders.temp().getFile("data.json");
        return new Promise((resolve, reject) => {
            file.readText().then((result) => {
                resolve(JSON.parse(result));
            }).catch((err) => {
                reject(err);
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
     * read the user database from firebase.
     * 
     * fetch data from firebase. 
     * if currently offline, the data will be get from the json file. 
     * else , the json file will be overwrite with the latest data fetched from firebase. 
     */
    FetchFirebase() {
        let path = "Users/" + appSettings.getString("user_id");
        return new Promise((resolve, reject) => {
            if (getConnectionType() != connectionType.none) {
                this.SetToken();
                firebase.getValue(path).then((result) => {
                    this.Data = result.value;
                    this.writefile(result.value);
                    console.log(result.value["Vehicles"]);
                    resolve(result.value);
                }).then(() => {
                    this.fetchBranch();
                })
                    .catch((err) => {
                        reject(err);
                    });
            } else {
                this.readfile().then((result) => {
                    this.Data = result;
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                });
            }
        });
    }

    /**
     * return the vehicle list to the front end list view. 
     */
    VehicleList() {
        let data = [];
        return new Promise((resolve, reject) => {
            this.FetchFirebase().then((result) => {
                for (var a in this.Data) {
                    let res = this.Data[a];
                    if (typeof res.Image !== 'undefined') {
                        data.push({ Photo: res.Image, vehicle_plate_no: res.plate_no, vehicle_key: a, current_odo: res.current_Odo, image_path: res.Image_path });
                    }
                }
            }).then(() => {
                resolve(data);
            }).catch((error) => {
                console.log(error);
                reject();
            });
        });
    }

    /**
     * 
     * return the report list to the front end report list view 
     */
    ReportList(branch: boolean) {
        let data_to_return = [];
        if (appSettings.hasKey("vehicle_key")) {
            let vehicle = appSettings.getString("vehicle_key");
            let fetch;
            if (branch) {
                fetch = this.Branch[vehicle];
            } else {
                fetch = this.Data[vehicle];
            }
            for (var report_type in fetch) {
                if (report_type == "Refuel" || report_type == "Service" || report_type == "Expenses" || report_type == "Reminder" || report_type == "Insurance") {
                    let details = fetch[report_type];
                    for (var detail in fetch[report_type]) {
                        if (typeof details[detail].Date !== "undefined") {
                            let data = details[detail];
                            data_to_return.push({
                                id: detail,
                                report_type: data["Report_type"],
                                Date: data["Date"],
                                Time: data["Time"],
                                Fuel_Type: data["Fuel_type"],
                                Fuel_Price: data["Fuel_price"],
                                Amount_Paid: data["Amount"],
                                Total_Volume: data["Fuel_Volume"],
                                Location: data["Location"],
                                Odometer: data["Odometer"],
                                Note: data["Note"],
                                Photo: data["Image"],
                                Parts: data["Parts"],
                                Expenses_type: data["Expenses_type"],
                                Insurance_Company: data["Company"],
                                Insurance_type: data["Type"],
                                Image_path: data["Image_path"]
                            });
                        }
                    }

                }
            }

        }
        return data_to_return;

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
     * 
     * mainly purpose for the application to upload any data to the firebase 
     * perform data check.
     * 
     * if cururently offline, the data will be written into the json file for temporary storage. 
     * 
     */
    UploadData(path: string, data) {
        let image_path = data.Image;
        return new Promise((resolve, reject) => {
            if (getConnectionType() != connectionType.none) {
                this.uploadImage(image_path)
                    .then((result) => {
                        data.Image = result["link"];
                        data.Image_path = result["image_path"];
                    })
                    .then(() => {
                        firebase.push(path, data).then(() => {
                            this.FetchFirebase().then(() => {
                                resolve()
                            });
                        }).catch(() => {
                            reject();
                        });
                    })
            } else {
               // this.writeOffline(path, data);
               alert("Unable to upload in Offline mode.");
                resolve();
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    /**
     * write the data into a file in offline mode. 
     */
    /* 
    private key = "ab!87nd*@wq4PI89JM";  //a random generated string for seperate the data.
    private writeOffline(path: string, data: JSON) {
        alert("You are now Offline , report will shown while you are connected to network.");
        const file = knownFolders.temp().getFile("OfflineData");
        const result = path + JSON.stringify(data) + this.key;
        file.readText().then((res) => {
            let d = res + result;
            file.writeText(d).then(() => {
            })
        }).catch((err) => {
            console.log(err);
        });
    }
    */
    /**
     * called while the user are currently online(connected to network)
     * 
     * fetch the data from the json file which stored before and upload it into firebase. 
     */
    /*
    private readOffline() {
        const file = knownFolders.temp().getFile("OfflineData");
        file.readText().then((result) => {
            file.remove();
            let res = result.split(this.key);
            for (var a in res) {
                let position = res[a].indexOf("{");
                if (position != -1) {
                    let split = res[a].split("{");
                    let path = split[0];
                    let data = JSON.parse("{" + split[1]);
                    this.UploadData(path, data).then((res) => {
                    });
                }
            }

        }).catch((err) => {
            console.log(err);
        });
    }
    */
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
     * remove the vehicle from firebase 
     * remove the vehicle photo from firebase 
     * refresh the data by fetch from firebase again. 
     */
    RemoveItem(path, data) {
        if (getConnectionType() != connectionType.none) {
            firebase.remove(path + "/" + data.vehicle_key).then((result) => {
                firebase.storage.deleteFile({ remoteFullPath: data.image_path }).then(() => {
                    this.FetchFirebase().then(() => { });
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    /**
     * remove the report from firebase. 
     * remove the report photo from firebase. 
     * refresh the data by re-fetch from firebase. 
     */
    Remove_Report(path, data) {
        let delete_path = path + "/" + data.report_type + "/" + data.id;
        firebase.remove(delete_path).then((result) => {
            firebase.storage.deleteFile({ remoteFullPath: data.Image_path }).then((res) => {
                this.FetchFirebase().then(() => {
                });
            });
        }).catch((error) => {
            console.log(error);
        });
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
            this.uploadImage(profilePicture).then((result) => {
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

    /*
    * return summary of the data.
    */
    getTotalNumberOfVehicle() {
        return new Promise((resolve, reject) => {
            resolve(this.Data.Summary);
        })
    }

    /**
     * return number of branch under the user. 
     */
    getNumberOfBranch() {
        let count = 0;
        for (var branch in this.Data.Branch) {
            count++;
        }
        return count;
    }

    /**
     * refresh the data 
     */
    Refresh() {
        this.FetchFirebase();
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

    /**
     * 
     * add new master to this user. 
     * the current master will be override.
     */
    AddMaster(master_id: string) {
        let path = "Users/" + appSettings.getString("user_id") + "/Master";
        firebase.setValue(path, { "ID": master_id }).then((result) => {
        }).catch((err) => {
            console.log(err);
        });
    }
    Branch = {};    // used to store the branch data.

    /**
     * fetch the branch data from firebase. 
     */
    fetchBranch() {
        this.BranchUserList = [];
        for (var id in this.Data.Branch) {
            firebase.getValue("Users/" + this.Data.Branch[id] + "/User_Profile").then((result) => {
                this.BranchUserList.push({
                    id: this.Data.Branch[id],
                    photo: result.value["Profile_Pic"],
                    name: result.value["Username"]
                });
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    /**
     * return the branch vehicle list
     */
    BranchVehicle(user_id) {
        let list = [];
        return new Promise((resolve, reject) => {
            firebase.getValue("Users/" + user_id).then((result) => {
                this.Branch = result.value;
                let res = result.value;
                for (var vehicle in res) {
                    if (typeof res[vehicle]["plate_no"] !== "undefined") {
                        list.push({
                            Photo: res[vehicle]["Image"], vehicle_plate_no: res[vehicle]["plate_no"], vehicle_key: vehicle
                        })
                    }
                }
            }).then(() => {
                resolve(list);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * return all branch user name 
     */
    BranchUserName() {
        return this.BranchUserList;
    }
    /**
     * remove the branch , remove only can be used by master to remove branch 
     * branch are not able to remove master view 
     * 
     * user_id and branch id to the thread 
     */
    removeBranch(branch_id, name) {

        firebase.getValue("Users/" + appSettings.getString("user_id") + "/Branch").then((result) => {
            for (var branch_key in result.value) {
                if (result.value[branch_key] == branch_id) {
                    let path = "Users/" + appSettings.getString("user_id") + "/Branch/" + branch_key;
                    firebase.remove(path).then((result) => {
                        alert(name + " has successfully deleted. ");
                    }).catch((err) => {
                        console.log(err);
                        alert("Unable to remove the branch. ");
                    });
                }
            }
        }).catch((err) => {
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
