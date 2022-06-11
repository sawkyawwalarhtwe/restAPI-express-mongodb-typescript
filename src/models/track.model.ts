import mongoose from "mongoose";
import { UserDocument } from "./user.model";

export interface TrackInput{
    user: UserDocument['id'],
    clusterUrl: string,
    payload: string,

}

export interface TrackDocument extends TrackInput, mongoose.Document{
    createdAt: Date,
    updatedAt: Date,
}

const trackSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        clusterUrl: {type: String},
        payload: {type: String},
    },
    {
        timestamps: true,
    }
);

const trackModel = mongoose.model<TrackDocument>("Track", trackSchema);

export default trackModel;