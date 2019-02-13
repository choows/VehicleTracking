/**
 * this file is the service provided to all the Vehicle 
 * 
 * for example like : 
 * 
 *  Download data
 * 
 *  Upload data
 * 
 *  
 */

import { Injectable } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";
import * as appSettings from "tns-core-modules/application-settings";
import { knownFolders, File } from "tns-core-modules/file-system";
import { connectionType, getConnectionType } from "tns-core-modules/connectivity";
import { UserService } from "../shared/user.service";
import * as dialogs from "tns-core-modules/ui/dialogs";
@Injectable()
export class VehicleService {

    private Vehicle_Detail: JSON;

    /**
     *  function write the vehicle list into a json file for local storage. 
     * 
     * overwrite the data of json everytime 
     * 
     * @param result result fetch from firebase (vehicles)
     */
    private writefile(result) {
        const file = knownFolders.temp().getFile("vehicle.json");
        file.writeText(JSON.stringify(result)).then((result) => {
        }).catch((err) => {
            console.log(err);
        });
    }

    /**
     * function read the vehicle list from the json file during offline mode. 
     */
    private readfile() {
        const file = knownFolders.temp().getFile("vehicle.json");
        return new Promise((resolve, reject) => {
            file.readText().then((result) => {
                resolve(JSON.parse(result));
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * fetch the json data from the firebase and store into the local json file 
     * 
     */
    private FetchVehicle() {
        const path = "Users/" + appSettings.getString("user_id") + "/Vehicles";
        return new Promise((resolve, reject) => {
            if (getConnectionType() != connectionType.none) {
                firebase.getValue(path).then((result) => {
                    //result.value
                    this.writefile(result.value);
                    this.Vehicle_Detail = result.value;
                    resolve();
                }).catch((err) => {
                    reject();
                });
            } else {
                this.readfile().then((result: JSON) => {
                    this.Vehicle_Detail = result;
                    // resolve(result);
                    resolve();
                }).catch((err) => {
                    reject();
                });
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    /**
     * return the vehicle list into the front end list 
     */
    GetVehicle() {
        return new Promise((resolve, reject) => {
            var vehicles_json = null;
            var vehicle_list = [];
            this.FetchVehicle().then(() => {
                vehicles_json = this.Vehicle_Detail;
            }).then(() => {
                vehicle_list = this.vehicle_list_arrange(vehicles_json);
            }).then(() => {
                resolve(vehicle_list);
            }).catch((err) => {
                console.log(err);
                reject();
            });
        });
    }

    /**
     * rearrange the data into a list with the data with format below 
     * 
     */
    private vehicle_list_arrange(vehicles_json) {
        var vehicle_list = [];
        for (var vehicle_id in vehicles_json) {
            const vehicle = vehicles_json[vehicle_id];
            vehicle_list.push({
                Photo: vehicle.Image,
                vehicle_plate_no: vehicle.plate_no,
                current_odo: vehicle.current_Odo,
                image_path: vehicle.Image_path
            });

        }
        return vehicle_list;
    }

    /**
     * add new vehicle 
     */
    NewVehicle(detail) {
        let path: string = "Users/" + appSettings.getString("user_id") + "/Vehicles/" + detail.plate_no;
        let userservice: UserService = new UserService();
        return new Promise((resolve, reject) => {
            if (getConnectionType() != connectionType.none) {
                userservice.uploadImage(detail.Image).then((result) => {
                    detail.Image = result["link"];
                    detail.Image_path = result["image_path"];
                }).then(() => {
                    firebase.setValue(path, detail).then((result) => {
                        this.FetchVehicle().then(() => {
                            resolve();
                        });
                    });
                }).catch((err) => {
                    console.log(err);
                    reject();
                });
            } else {
                resolve();
            }
        });
    }

    /**
     * remove a vehicle(include with the image in storage)
     */
    RemoveVehicle(detail) {
        if (getConnectionType() != connectionType.none) {
            let path = "Users/" + appSettings.getString("user_id") + "/Vehicles/" + detail.vehicle_plate_no;
            firebase.remove(path).then(() => {
                firebase.storage.deleteFile({ remoteFullPath: detail.image_path });
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    /**
     * Add new Report
     */
    NewReport(report_detail) {
        return new Promise((resolve, reject) => {
            if (getConnectionType() != connectionType.none) {
                let path: string = "Users/" + appSettings.getString("user_id") + "/Vehicles/" + appSettings.getString("plate_no") + "/Reports/" + report_detail["Report_type"];
                let userservice: UserService = new UserService();
                userservice.uploadImage(report_detail.Image).then((result) => {
                    report_detail.Image = result["link"];
                    report_detail.Image_path = result["image_path"];
                }).then(() => {
                    firebase.push(path, report_detail).then(() => {
                        this.FetchVehicle();
                    }).then(() => {
                        resolve();
                    });
                }).catch((err) => {
                    console.log(err);
                    reject();
                });
            } else {
                resolve();
            }
        });

    }

    /**
     * Fetch Vehicle Report
     * 
     * the loop must in the same fuction to perform faster 
     * 
     * 
     * tried to seperate into different function but seems cannot be work. 
     */
    GetReport(): any[] {
        let Vehicle_Report = this.Vehicle_Detail[appSettings.getString("plate_no")]["Reports"];
        let report_list = [];
        for (var report_type in Vehicle_Report) {
            if (report_type != "Total") {
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
        }
        return report_list;
    }


    /**
     * remove a report and remove the image
     */
    Remove_Report(report_detail) {
        if (getConnectionType() != connectionType.none) {
            let path = "Users/" + appSettings.getString("user_id") + "/Vehicles/" + appSettings.getString("plate_no") + "/Reports/" + report_detail.report_type + "/" + report_detail.id;
            firebase.remove(path).then(() => {
                firebase.storage.deleteFile({ remoteFullPath: report_detail.Image_path }).then(() => {
                    this.FetchVehicle();
                });
            }).catch((error) => {
                console.log(error);
            });
        }
    }
}