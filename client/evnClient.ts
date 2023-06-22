import axios, { AxiosResponse } from "axios";
import fs from "fs";
import { readFile } from "xlsx";
import { EvnModel } from "../model/evnModel";
import { userModel } from "../model/userModel";

//function to make a get request to the url which has a html response
export async function getEvnSite() {
  try {
    const response: AxiosResponse = await axios.get(
      "https://www.elektrodistribucija.mk/Grid/Planned-disconnections.aspx"
    );

    const html = response.data;
    const startIndex = html.indexOf(
      "/Files/Planirani-isklucuvanja-Samo-aktuelno/"
    );
    const endIndex = html.indexOf('">Листа', startIndex);
    const downloadUrl = html.substring(startIndex, endIndex);
    console.log("Download: " + downloadUrl);

    return downloadUrl;
  } catch (error) {
    console.log(error);
    throw new Error(
      "Cant open EVN site to see if there are any planned outages.."
    );
  }
}

export async function saveEvnFile() {
  console.log("Prepare to download file...");
  const url = "https://www.elektrodistribucija.mk" + (await getEvnSite());
  console.log("URL: " + url);

  try {
    const response = await axios.get(url, { responseType: "stream" });

    const writer = fs.createWriteStream("evn-data/evnOutages.xlsx");
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      console.log("File downloaded...");
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.log(url);
    throw new Error("File download failed or file does not exist...");
  }
}

export async function parseEvnData(): Promise<Array<EvnModel>> {
  await saveEvnFile();

  const workbook = readFile("evn-data/evnOutages.xlsx");

  console.log(workbook.SheetNames);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  //if file is empty
  if (sheet["!ref"] == "A1") {
    return [];
  }

  let firstDataRow = 3;
  const lastDataRowNumber =
    parseInt(sheet["!ref"]?.split(":")[1].slice(1) ?? "0") - 1;
  let evnData = Array<EvnModel>();

  while (firstDataRow <= lastDataRowNumber) {
    const start = sheet[`A${firstDataRow}`]?.w;
    const end = sheet[`B${firstDataRow}`]?.w;
    const duration = sheet[`C${firstDataRow}`]?.w;
    const municipality = sheet[`D${firstDataRow}`]?.w;
    const address = sheet[`E${firstDataRow}`]?.w;

    evnData.push({
      start: start ?? "",
      end: end ?? "",
      duration: duration ?? "",
      municipality: municipality ?? "",
      address: address ?? "",
    });

    firstDataRow++;
  }
  return evnData;
}

export function searchEvnOutages(
  data: Array<EvnModel>,
  user: userModel
): Array<EvnModel> {
  return data.filter((evn) =>
    evn.municipality.toLowerCase().match(user.userEnergyCenter) && user.addressLocations.some((address) => evn.address.toLowerCase().includes(address))
  );
}
