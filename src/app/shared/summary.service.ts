/**
 * this service is provided to the summary 
 * 
 * 
 * for example like : 
 * 
 *  Fetch summary 
 *  
 *  Calculate the chart 
 * 
 *  Rearrange the chart data. 
 * 
 * chart type 
 * 
 * cost per day ,
 * cost per vehicle ,
 * fuel price ,
 * 
 * 
 * cost on report for each vehicle. 
 * 
 * As the result of testing :::::::::   using the main thread is faster then using the multi thread to run the rearrange progress. 
 * 
 * thus, i will choose to use the single thread to complete this code. 
 */

import { Injectable } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";
import * as appSettings from "tns-core-modules/application-settings";
import { knownFolders, File } from "tns-core-modules/file-system";
import { connectionType, getConnectionType } from "tns-core-modules/connectivity";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { from } from "rxjs";
import * as TSWorker from "nativescript-worker-loader";
@Injectable()
export class SummaryService {

    private result = [];
    private cost_per_day_result = [];
    private Fuel_Price_List = [];
    /**
     * return the result into ront end
     */
    getvehicleJSON() {
        return new Promise((resolve, reject) => {
            this.readfile().then((result: JSON) => {
                this.result = this.rearrange(result);
                this.costperday(result);
            }).then(() => {
                this.getFuelPrice().then(() => {
                    resolve();
                });
            }).catch((err) => {
                console.log(err);
                reject();
            });
        })
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
     * try with the single thread
     */
    private rearrange(result: JSON) {
        let usage_per_vehicle: any[] = [];
        for (var vehicles in result) {
            if (typeof result[vehicles]["Reports"] !== "undefined") {
                const vehicle_report = result[vehicles]["Reports"]["Total"];
                usage_per_vehicle.push({
                    plate_number: vehicles,
                    usage: vehicle_report["Total_Cost"]
                });
            }

        }
        return usage_per_vehicle;
    }


    /**
     * start to run the cost per day. for all vehicle. 
     * 
     * read all report's date and cost. 
     * 
     * and then combine into array. 
     * 
     * 
     * 
     * sent the data into json and then cnovert into aray
     */
    private costperday(result: JSON) {
        //let usage_per_day : any[] = [] ; 
        const nowdate = new Date(Date.now());
        var results : JSON ;
        for (var vehicles in result) {
            const vehicle_Report = result[vehicles]["Reports"];
            for (var report_type in vehicle_Report) {
                if (report_type != "Total") {
                    const reports = vehicle_Report[report_type];
                    for (var report_num in reports) {
                        if (typeof reports[report_num]["Amount"] !== "undefined") {
                            const report = reports[report_num];
                            const date = new Date(report["Date"]);
                            if (date.getMonth() == nowdate.getMonth()) {          //to define the month to be this month 
                                this.cost_per_day_result.push({
                                    Date: date.getDate(),
                                    Amount: report["Amount"]
                                });
                               // results[date.getDate()][report["Amount"]];
                                
                            }
                        }
                    }
                }
            }
        }
       // this.rearrangecostperday();
       console.log(results);
    }

    private rearrangecostperday(){
        var result : JSON ; 
        for(var index in this.cost_per_day_result){
            for(var i in result){
             
            }
        }
    }
    /**
var output = [];

array.forEach(function(item) {
  var existing = output.filter(function(v, i) {
    return v.name == item.name;
  });
  if (existing.length) {
    var existingIndex = output.indexOf(existing[0]);
    output[existingIndex].value = output[existingIndex].value.concat(item.value);
  } else {
    if (typeof item.value == 'string')
      item.value = [item.value];
    output.push(item);
  }
});

console.dir(output);
     */


    /**
     * the month have to +1 ......
     */
    private getFuelPrice() {
        return new Promise((resolve, reject) => {
            const date = new Date(Date.now());
            const month: number = date.getMonth() + 1;
            firebase.getValue("Fuel_Price/" + month.toString()).then((result) => {
                for (var dates in result.value) {
                    const fuelprice = result.value[dates];
                    // console.log(fuelprice);
                    this.Fuel_Price_List.push({
                        Date: dates,
                        Ron95: fuelprice["Ron95"],
                        Ron97: fuelprice["Ron97"],
                        Diesel: fuelprice["Diesel"]
                    });
                }
                resolve();
            }).catch((err) => {
                console.log(err);
                reject();
            });
        })

    }

    return_cost_per_day() {
       // return this.cost_per_day_result;
       var array : any[] = [] ; 
       for(var i in this.cost_per_day_result){
           var item = this.cost_per_day_result[i];
           var counter = true;
           for(var arr_item in array){
               if(array[arr_item].Date == item.Date){
                    array[arr_item].Amount += item.Amount;
                    counter = false;
               }
           }
           if(counter){
               array.push({
                   Date : item.Date,
                   Amount : item.Amount
               });
           }
       }
       return array;
    }

    return_cost_per_vehicle() {
        return this.result;
    }
    return_Fuel_price_list() {
        return this.Fuel_Price_List;
    }
}