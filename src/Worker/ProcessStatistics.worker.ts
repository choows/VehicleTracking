import "globals";

const context: Worker = self as any;

context.onmessage = msg => {
        let result = msg.data["result"];
        let usage_per_vehicle : any[] = [] ; 
        for(var vehicles in result){
            const vehicle_report = result[vehicles]["Reports"]["Total"] ; 
            usage_per_vehicle.push({
                plate_number : vehicles,
                usage : vehicle_report["Total_Cost"]
            });
        }
        context.postMessage({result : usage_per_vehicle});
};
