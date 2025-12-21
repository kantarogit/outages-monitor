import axios, { AxiosResponse } from "axios";
import { OutageModel } from "../model/evnModel";
import { UserModel } from "../model/userModel";

export async function getAllOutages(): Promise<Array<OutageModel>> {
  try {
    console.log('Getting outages from EVN site...');
    const response: AxiosResponse = await axios.get(
      "https://portal-api.elektrodistribucija.mk/DSO/Prekini/ZemiPrekini"
    );

    const rawData = response.data;

    if (!Array.isArray(rawData)) {
      throw new Error("Unexpected response format from EVN site: expected an array.");
    }

    // console.log(rawData);
    return rawData
      .filter((outageItem: any) => {
        return (
          outageItem !== null &&
          typeof outageItem === "object" &&
          typeof outageItem.nasMesto === "string" &&
          typeof outageItem.adresa === "string"
        );
      })
      .map((outageItem: { pocetok: any; kraj: any; napNivo: any; nasMesto: string; adresa: string; tipPrekin: any; kecId: any; }) => {
        return {
          start: outageItem.pocetok,
          end: outageItem.kraj,
          voltageLevel: outageItem.napNivo,
          municipality: outageItem.nasMesto.toLowerCase(),
          address: outageItem.adresa.toLowerCase(),
          type: outageItem.tipPrekin,
          energyCenter: outageItem.kecId
        } as OutageModel;
      });
  } catch (error) {
    console.log(error);
    throw new Error(
      "Failed to fetch data from EVN site..."
    );
  }
}

export function searchEvnOutages(
  evnOutagesData: Array<OutageModel>,
  user: UserModel
): Array<OutageModel> {
  return evnOutagesData.filter((outageRecord) => {
    return outageRecord.municipality.toLowerCase()
      .match(user.municipality.toLowerCase()) && 
      user.addressLocations.some((address) => 
        outageRecord.address.toLowerCase().includes(address.toLowerCase())) }
  );
}
