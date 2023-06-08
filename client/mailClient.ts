import { OutagesPerUserModel } from "../model/outagesModel";

const mailjet = require("node-mailjet").apiConnect(
  "2beb28c48c2a7e89bb1320cb7231f442",
  "9307030d392d74c4646a8aa40d5b4683"
);

export async function sendEmail(outagesPerUser: Array<OutagesPerUserModel>) {
  outagesPerUser.forEach((user: OutagesPerUserModel) => {
    const outages = user.outages;
    const html =
      outages.length > 0
        ? "<h3>Planned outages for your address</h3> <br/> <ul>" +
          outages
            .map(
              (outage) => 
                `<li>${outage.municipality} - ${outage.address} - ${outage.start} - ${outage.end}</li>`
            )
            .join("") +
          "</ul>"
        : "<h3>There are no planned outages for your address</h3>";

    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "kantarofilip@gmail.com",
            Name: "EVN Outages",
          },
          To: [
            {
              Email: user.email,
            },
          ],
          Subject: "Planned outages for tomorrow",
          TextPart: "Planned outages for tomorrow",
          HTMLPart: html,
        },
      ],
    });
    request
      .then((result: any) => {
        console.log(result.body);
      })
      .catch((err: any) => {
        console.log(err.statusCode);
      });
  });
}

sendEmail([
  {
    email: "kantarofilip@gmail.com",
    outages: [
      {
        start: "2023-06-08T07:00:00.000Z",
        end: "2023-06-08T11:00:00.000Z",
        municipality: "Скопје Ѓорче Петров",
        address:
          "СКОПЈЕ - КАРПОШ: Дел од корисниците на Осло (од страната кон Реплек)",
      },
    ],
  },
]);
