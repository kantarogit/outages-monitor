import { EvnModel } from "./evnModel"

export type OutagesPerUserModel = {
    email: string,
    outages: Array<EvnModel>
}