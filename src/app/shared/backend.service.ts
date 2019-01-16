import * as firebase from "nativescript-plugin-firebase";
import * as appSettings from "tns-core-modules/application-settings";
import * as dialogs from "tns-core-modules/ui/dialogs";
/**
 * in android : 
 *  the message receive in foreground will display the title and subtitle 
 * the message receive in background will not display the title and subtitle 
 *  
 *  by the way , the data passing will always appear even in background. 
 * 
 */
export class BackendService {
    static setup() {
        firebase.init({
            persist: true,
            showNotificationsWhenInForeground: true,
            onMessageReceivedCallback: (message) => {
                if(message.foreground){
                    dialogs.alert({
                        //also a from section , does not know what it mean for. 
                        title : message.title,
                        message : message.body,
                        okButtonText : "OK"
                    });
                    //message.data
                }else{
                    //message.data
                }
              },
            onAuthStateChanged: function (data) { // optional but useful to immediately re-logon the user when he re-visits your app
                if (data.loggedIn) {
                    appSettings.setString("user_id", data.user.uid);
                    firebase.keepInSync("Users/" + data.user.uid, true).then(() => {
                    }).then(() => {
                    }).catch((err)=>{
                        console.log(err);
                    });
                } else {
                    appSettings.clear();
                }
            },
            onPushTokenReceivedCallback : (token)=>{
                console.log("Token : " + token);
            }
        }).then(
            instance => {
            },
            error => {
                console.log(`firebase.init error: ${error}`);
            }
        );

    }
}
