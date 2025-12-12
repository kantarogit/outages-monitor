import { OutageModel } from "./evnModel"

export type OutagesPerUserModel = {
    email: string,
    outages: Array<OutageModel>
}