import "globals";
import * as firebase from "nativescript-plugin-firebase";

const context: Worker = self as any;

context.onmessage = msg => {
    const branch_id = msg.data.branch_id;
    const usr_id = msg.data.user_id;
    firebase.getValue("Users/" + usr_id + "/Branch").then((result) => {
        for (var branch_key in result.value) {
            if (result.value[branch_key] == branch_id) {
                let path = "Users/" + usr_id + "/Branch/" + branch_key;
                firebase.remove(path).then((result) => {
                    (<any>global).postMessage("Complete");
                });
            }
        }
    }).catch((err) => {
        console.log(err);
        (<any>global).postMessage("Failed");
    });

};
