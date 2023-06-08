import { getUsers } from "./client/configClient";
import { parseEvn, searchEvnOutages } from "./client/evnClient";
import { OutagesPerUserModel } from "./model/outagesModel";
import { userModel } from "./model/userModel";

export async function processEvnData(): Promise<Array<OutagesPerUserModel>> {
    let outagesPerUser = Array<OutagesPerUserModel>();

    getUsers().forEach((user: userModel) => {
        const searchLocations = user.searchLocations;
        let data = parseEvn();
        let outages = searchEvnOutages(data, searchLocations);

        outagesPerUser.push({
            email: user.email,
            outages: outages,
        });
    });
    console.log(JSON.stringify(outagesPerUser));
    return outagesPerUser;
}

processEvnData();
