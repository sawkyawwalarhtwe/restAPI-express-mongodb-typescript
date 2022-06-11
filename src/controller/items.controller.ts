import { Request, Response } from 'express';
import { createItems } from '../service/items.service';
import { findProduct } from '../service/product.service';
import { findUser } from '../service/user.service';

export async function createItemsHandler( req: Request, res: Response ){
    const temp = await findProduct({title:req.body.title});
    const temp2 = await findUser({email:req.body.email});
    const cus = temp2?._id;
    const product = temp?._id;
    const userId = res.locals.user._id;
    const items = await createItems({
    user: userId, product: product, cosumer: cus
});
    return res.send(items);
}