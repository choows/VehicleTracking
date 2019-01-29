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
import * as dialogs from "tns-core-modules/ui/dialogs";
@Injectable()
export class VehicleService {

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
    private FetchVehicle(){
        const path = "Users/" +  appSettings.getString("user_id") + "/Vehicles" ; 
        return new Promise((resolve, reject)=>{
            if(getConnectionType() != connectionType.none){
                firebase.getValue(path).then((result)=>{
                    //result.value
                    this.writefile(result.value);
                    resolve(result.value);
                }).catch((err)=>{
                    reject();
                });
            }else{
                this.readfile().then((result)=>{
                    resolve(result);
                }).catch((err)=>{
                    reject();
                });
            }
        }).catch((err)=>{
            console.log(err);
        });
    }

    /**
     * return the vehicle list into the front end list 
     */
    GetVehicle(){
        return new Promise((resolve, reject)=>{
            var vehicles_json = null;
            var vehicle_list = [] ; 
            this.FetchVehicle().then((result)=>{
                vehicles_json = result; 
            }).then(()=>{
                vehicle_list = this.vehicle_list_arrange(vehicles_json);
            }).then(()=>{
                resolve(vehicle_list);
            }).catch((err)=>{
                console.log(err);
            });
        });
    }

    /**
     * rearrange the data into a list with the data with format below 
     * 
     */
    private vehicle_list_arrange(vehicles_json){
        var vehicle_list = [] ; 
        for(var vehicle_id in vehicles_json){
            const vehicle = vehicles_json[vehicle_id];
            vehicle_list.push({
                Photo : vehicle.Image ,
                vehicle_plate_no: vehicle.plate_no ,
                vehicle_key: vehicle_id,
                current_odo: vehicle.current_Odo,
                image_path: vehicle.Image_path
                });
        }
        return vehicle_list ; 
    }
}