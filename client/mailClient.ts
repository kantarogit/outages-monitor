import { OutagesPerUserModel } from "../model/outagesModel";
const mailApiKey = process.env.MAIL_API_KEY;
const mailApiSecret = process.env.MAIL_SECRET;
const mailjet = require("node-mailjet").apiConnect(mailApiKey, mailApiSecret);

export async function sendEmail(outagesPerUser: Array<OutagesPerUserModel>) {
  console.log("inside sendEmail");
  console.log(outagesPerUser);
  outagesPerUser.forEach((user: OutagesPerUserModel) => {
    const outages = user.outages;
    const html =
      outages.length > 0
        ? "<h3>Planned outages for your address</h3> <br/> <ul>" +
          outages
            .map(
              (outage) =>
                `<li>${outage.municipality} - ${outage.address}<br/><h2>${outage.start} - ${outage.end}</h2></li>`
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
