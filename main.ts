import { getUsers } from "./client/configClient";
import { getAllOutages, searchEvnOutages } from "./client/evnClient";
import { OutagesPerUserModel } from "./model/outagesModel";

export async function evnFlow(): Promise<Array<OutagesPerUserModel>> {
  let outagesPerUser = Array<OutagesPerUserModel>();

  const outageApiResponse = await getAllOutages();
  console.log("Outages fetched from EVN site...");
  console.log(outageApiResponse)

  for (const user of getUsers()) {
      let outages = searchEvnOutages(outageApiResponse, user);

      outagesPerUser.push({
        email: user.email,
        outages: outages,
      });
}

  return outagesPerUser;
}

evnFlow()
  .then((outagesPerUser: Array<OutagesPerUserModel>) => {
    console.log(JSON.stringify(outagesPerUser, null, 2));
    // sendEmail(outagesPerUser);
  })
  .catch((err: any) => {
    console.log(err);
  });
