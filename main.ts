import { getUsers } from "./client/configClient";
import { parseEvnData, searchEvnOutages } from "./client/evnClient";
import { sendEmail } from "./client/mailClient";
import { OutagesPerUserModel } from "./model/outagesModel";

export async function evnFlow(): Promise<Array<OutagesPerUserModel>> {
  let outagesPerUser = Array<OutagesPerUserModel>();

  let data = await parseEvnData();
  if (data.length > 0) {
    for (const user of getUsers()) {
      let outages = searchEvnOutages(data, user);

      outagesPerUser.push({
        email: user.email,
        outages: outages,
      });
    }
  }
  return outagesPerUser;
}

evnFlow()
  .then((outagesPerUser: Array<OutagesPerUserModel>) => {
    console.log(outagesPerUser);
    sendEmail(outagesPerUser);
  })
  .catch((err: any) => {
    console.log(err);
  });
