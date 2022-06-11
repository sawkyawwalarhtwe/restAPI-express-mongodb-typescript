import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import itemsModel, {ItemsDocument, ItemsInput} from "../models/items.model";
import { databaseResponseTimeHistogram } from "../utils/metrics";

export async function createItems(input: ItemsInput){
    try{
        const result = await itemsModel.create(input);
        return result;
    }catch(e){
        throw(e);
    }
}