import { Request, Response } from 'express';
import _ from 'lodash';
import ProductModel from '../models/product.model';
import UserModel from '../models/user.model';
import { findTracks } from '../schema/track.schema';
import { createTrack } from '../service/track.service';
import { checkUserRole, findUsers } from '../service/user.service';


export async function createTrackHandler( req: Request, res: Response ){
const userId = res.locals.user._id;
const clusterUrl = res.locals.user.clusterUrl;
const payload = req.body.payload;

const track = await createTrack({user: userId, clusterUrl: clusterUrl, payload: payload});
return res.send(track);
}

export async function createTrackByDeviceHandler( req: Request, res: Response ){
    const product = await ProductModel.findOne({productId:req.params.productId});
    if(product){
        const user = await UserModel.findOne({_id:product.user}).lean();
        if(user){
            const userId = user._id;
            const clusterUrl = user._id;
            const payload =req.body.payload;
            const track = await createTrack({user: userId, clusterUrl: clusterUrl, payload: payload});
            return res.send(track);
        }

    }
    return res.sendStatus(404);
    }

export async function getTrackHandler( req: Request, res: Response){
    const userId = res.locals.user._id;
    let userRole = await (checkUserRole(res.locals.user.role).catch());
    if(userRole == null){
        let track = await findTracks({user:userId})
        return res.send(track);
    }

    const user = await findUsers({$or:userRole});
    
    let ids = _.map(user, function (a) {
        return a._id;
      })
    const tracks = await findTracks({user:ids});
    res.send(tracks);
}