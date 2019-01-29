/**
 * this service is provided to the branch 
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

    
}