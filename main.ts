import { getUsers } from "./client/configClient";
import { parseEvn, searchEvnOutages } from "./client/evnClient";
import { sendEmail } from "./client/mailClient";
import { OutagesPerUserModel } from "./model/outagesModel";
import { userModel } from "./model/userModel";

export async function processEvnData(): Promise<Array<OutagesPerUserModel>> {
  let outagesPerUser = Array<OutagesPerUserModel>();

  getUsers().forEach(async (user: userModel) => {
    const searchLocations = user.searchLocations;
    let data = await parseEvn();
    let outages = searchEvnOutages(data, searchLocations);

    outagesPerUser.push({
      email: user.email,
      outages: outages,
    });
  });
  console.log('outages per user: ');
  console.log(JSON.stringify(outagesPerUser));
  return outagesPerUser;
}

processEvnData()
  .then((outagesPerUser: Array<OutagesPerUserModel>) => {
    sendEmail(outagesPerUser);
  })
  .catch((err: any) => {
    console.log(err);
  });
