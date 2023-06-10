import { OutagesPerUserModel } from "../model/outagesModel";
const mailApiKey = process.env.MAIL_API_KEY;
const mailApiSecret = process.env.MAIL_SECRET;
const mailjet = require("node-mailjet").apiConnect(mailApiKey, mailApiSecret);

export async function sendEmail(outagesPerUser: Array<OutagesPerUserModel>) {
  console.log("inside sendEmail");
  console.log(outagesPerUser);
  outagesPerUser.forEach((user: OutagesPerUserModel) => {
    const outages = user.outages;
    let html;
    if (outages.length > 0) {
      html = "<h3>Planned outages for your locations</h3> <br/> <ul>";
      html += outages
        .map(
          (outage) =>
            `<li>${outage.municipality} - ${outage.address}<br/><h2>${outage.start} - ${outage.end}</h2></li>`
        )
        .join("");
      html += "</ul>";

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
            Subject: "Planned EVN power outage",
            TextPart: "Planned EVN power outage",
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
    }
  });
}
