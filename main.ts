import { getUsers } from "./client/configClient";
import { parseEvn, searchEvnOutages } from "./client/evnClient";
import { userModel } from "./model/userModel";

export async function processEvnData() {

    getUsers().forEach((user: userModel) => {
    
    const searchLocations = user.searchLocations;
    let data = parseEvn();
    let outages = searchEvnOutages(data, searchLocations);
    console.log("sending email to " + user.email + " with outages: ");
    console.log(outages);
    });
}

processEvnData();