import { OutagesPerUserModel } from "../model/outagesModel";
const mailApiKey = process.env.MAIL_API_KEY;
const mailApiSecret = process.env.MAIL_SECRET;
console.log('envvvvs');
console.log(process.env);


const mailjet = require("node-mailjet").apiConnect(
  mailApiKey, mailApiSecret
);

export async function sendEmail(outagesPerUser: Array<OutagesPerUserModel>) {
  console.log('inside sendEmail');
  console.log(outagesPerUser);
  outagesPerUser.forEach((user: OutagesPerUserModel) => {
    const outages = user.outages;
    const html =
      outages.length > 0
        ? "<h3>Planned outages for your address</h3> <br/> <ul>" +
          outages
            .map(
              (outage) => 
              // municipality and address should be in a same line but start and end time 1 line below
              // start and end should be bolded and with a red color h2 tag
              `<li>${outage.municipality} - ${outage.address}<br/><h2>${outage.start} - ${outage.end}</h2></li>`

                // `<li>${outage.municipality} - ${outage.address} - ${outage.start} - ${outage.end}</li>`
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

// const outagesPerUser: Array<OutagesPerUserModel> = JSON.parse(process.argv[2]);
// sendEmail(outagesPerUser);

// sendEmail([
//   {
//     email: "kantarofilip@gmail.com",
//     outages: [
//       {
//         start: "2023-06-08T07:00:00.000Z",
//         end: "2023-06-08T11:00:00.000Z",
//         municipality: "Скопје Ѓорче Петров",
//         address:
//           "СКОПЈЕ - КАРПОШ: Дел од корисниците на Осло (од страната кон Реплек)",
//       },
//     ],
//   },
// ]);
