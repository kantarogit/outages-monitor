import axios, { AxiosResponse } from "axios";
import fs from "fs";
import { readFile } from "xlsx";
import { EvnModel } from "../model/evnModel";

export async function saveEnvFile() {
  console.log("Prepare to download file...");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = (tomorrow.getMonth() + 1).toString().padStart(2, "0");
  const day = tomorrow.getDate().toString().padStart(2, "0");
  const url = `https://www.elektrodistribucija.mk/Files/Planirani-isklucuvanja-Samo-aktuelno/${year}${month}${day}_Planned_Outages_MK.aspx`;
  // const url =
  //   "https://www.elektrodistribucija.mk/Files/Planirani-isklucuvanja-Samo-aktuelno/20230609_Planned_Outages_MK.aspx";

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
    throw new Error("File download failed");
  }
}

export async function parseEvnData(): Promise<Array<EvnModel>> {
  await saveEnvFile();

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
    const municipality = sheet[`C${firstDataRow}`]?.w;
    const address = sheet[`D${firstDataRow}`]?.w;

    evnData.push({
      start: start ?? "",
      end: end ?? "",
      municipality: municipality ?? "",
      address: address ?? "",
    });

    firstDataRow++;
  }
  return evnData;
}

export function searchEvnOutages(
  data: Array<EvnModel>,
  addresses: Array<string>
): Array<EvnModel> {
  return data.filter((evn) =>
    addresses.every((address) => evn.address.toLowerCase().includes(address))
  );
}
