import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import trackModel, { TrackInput } from "../models/track.model";

export async function createTrack(input: TrackInput){

    try{

        const result = await trackModel.create(input);
        return result;
    }catch(e){
        throw e;
    }

}