import { object, string, TypeOf } from "zod";

export const createItemsSchema = object({
    body: object({
        title:string({
            required_error: "Title is required"
        }),
        email:string({
            required_error: "Email is required"
        })
    })
})