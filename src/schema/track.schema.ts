import { FilterQuery } from "mongoose";
import { object, string, TypeOf } from "zod";
import trackModel, { TrackDocument } from "../models/track.model";

export const createTrackSchema = object({
    body: object({
        payload:string({
            required_error: "Payload is required"
        })
    })
})

export async function findTracks(query: FilterQuery<TrackDocument>) {
    return trackModel.find(query).lean();
  }