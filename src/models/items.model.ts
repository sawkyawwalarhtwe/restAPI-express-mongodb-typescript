import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import { UserDocument } from "./user.model";
import { ProductDocument } from "./product.model";

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ',10);

export interface ItemsInput{
    user: UserDocument['id'],
    product: ProductDocument['id'],
    cosumer: UserDocument['id'],

}

export interface ItemsDocument extends ItemsInput, mongoose.Document{
    createdAt: Date,
    updatedAt: Date,
}

const itemsSchema = new mongoose.Schema(
    {
        itemsId:{
            type: String,
            required: true,
            unique: true,
            default: () => `product_${nanoid()}`,
        },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        cosumer: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        product: {type: mongoose.Schema.Types.ObjectId, ref: "Product"},
    },
    {
        timestamps: true,
    }
);

const itemsModel = mongoose.model<ItemsDocument>("Items", itemsSchema);

export default itemsModel;