/**
 * this service is provided to the Master-Branch features
 * 
 * for example : 
 *  
 *  Download branch data 
 * 
 *  Remove branch 
 * 
 *  Add Branch
 * 
 * 
 */

import { Injectable } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";
import * as appSettings from "tns-core-modules/application-settings";
import { knownFolders, File } from "tns-core-modules/file-system";
import { connectionType, getConnectionType } from "tns-core-modules/connectivity";
import * as dialogs from "tns-core-modules/ui/dialogs";
@Injectable()
export class BranchService {

    /**
     * Add a new Master account
     * 
     * @param master_id user id of the master user
     */
    AddMaster(master_id: string) {
        let path = "Users/" + appSettings.getString("user_id") + "/Master";
        firebase.setValue(path, { "ID": master_id }).catch((err) => {
            console.log(err);
        });
    }

    /**
     * return the list of branch user id. 
     */
    private FetchBranchID() {
        return new Promise((resolve, reject) => {
            let user_id_array = [];
            let path = "Users/" + appSettings.getString("user_id") + "/Branch";
            firebase.getValue(path).then((result) => {
                for (var id in result.value) {
                    user_id_array.push(result.value[id]);
                }
            }).then(() => {
                resolve(user_id_array);
            }).catch((err) => {
                console.log(err);
                reject();
            });
        });
    }

    Branches = [];
    /**
     * get the username of all the branch id and store in the variable "Branches"
     */
    private FetchBranchProfile(user_id_array: any[]) {
        this.Branches = [];
        for (var id in user_id_array) {
            let user_id = user_id_array[id];
            let path = "Users/" + user_id + "/User_Profile";
            firebase.getValue(path).then((result) => {
                this.Branches.push({
                    id: user_id,
                    profile_picture: result.value["Profile_Pic"],
                    user_name: result.value["Username"]
                });
            });
        }
    }

    /***
     * test for fethching the branch data and console the output 
     */
    FetchBranch() {

        this.FetchBranchID().then((result: []) => {
            this.FetchBranchProfile(result);
        }).catch((err) => {
            console.log(err);
        });
    }

    /**
     * return the branches list 
     */
    BranchesList() {
        return this.Branches;
    }

    BranchVehicles; //to temporary store the branch vehicle detail ... for easily search for vehicle detail and no need to fetch from firebase again\. 

    /**
     * 
     * @param user_id branch id 
     * 
     * fetch branches vehicles
     */
    BranchVehicle(user_id) {
        let list = [];
        return new Promise((resolve, reject) => {
            firebase.getValue("Users/" + user_id + "/Vehicles").then((result) => {
                let res = result.value;
                this.BranchVehicles = result.value;
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
     * Fetch branch vehicle detail 
     */
    BranchVehicleDetail(plate_num: string): any[] {
        let Vehicle_Report = this.BranchVehicles[plate_num]["Reports"];
        let report_list = [];
        for (var report_type in Vehicle_Report) {
            for (var reports in Vehicle_Report[report_type]) {
                let report_detail = Vehicle_Report[report_type][reports];
                if (typeof report_detail["Report_type"] != "undefined") {
                    report_list.push({
                        id: reports,
                        report_type: report_detail["Report_type"],
                        Date: report_detail["Date"],
                        Time: report_detail["Time"],
                        Fuel_Type: report_detail["Fuel_type"],
                        Fuel_Price: report_detail["Fuel_price"],
                        Amount_Paid: report_detail["Amount"],
                        Total_Volume: report_detail["Fuel_Volume"],
                        Location: report_detail["Location"],
                        Odometer: report_detail["Odometer"],
                        Note: report_detail["Note"],
                        Photo: report_detail["Image"],
                        Parts: report_detail["Parts"],
                        Expenses_type: report_detail["Expenses_type"],
                        Insurance_Company: report_detail["Company"],
                        Insurance_type: report_detail["Type"],
                        Image_path: report_detail["Image_path"]
                    });
                }
            }
        }
        return report_list;
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
}