import { getUsers } from "./client/configClient";
import { parseEvnData, searchEvnOutages } from "./client/evnClient";
import { sendEmail } from "./client/mailClient";
import { OutagesPerUserModel } from "./model/outagesModel";

export async function evnFlow(): Promise<Array<OutagesPerUserModel>> {
  let outagesPerUser = Array<OutagesPerUserModel>();

  for (const user of getUsers()) {
    const searchLocations = user.searchLocations;
    let data = await parseEvnData();
    let outages = searchEvnOutages(data, searchLocations);

    outagesPerUser.push({
      email: user.email,
      outages: outages,
    });
  }
  return outagesPerUser;
}

evnFlow()
  .then((outagesPerUser: Array<OutagesPerUserModel>) => {
    sendEmail(outagesPerUser);
  })
  .catch((err: any) => {
    console.log(err);
  });
