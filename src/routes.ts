import {Express, Request, Response } from 'express' //import types from express
import {createUserSchema, updateUserSchema} from './schema/user.schema'
import validateResource from "./middleware/validateResource";
import { createUserHandler, getUsersHandler, updateUserHandler } from './controller/user.controller'; 
import { createSessionSchema } from './schema/session.schema';
import { createUserSessionHandler, deleteSessionHandler, getUserSessionsHandler } from './controller/session.controller';
import requireUser from './middleware/requireUser';
import { createProductSchema, deleteProductSchema, getProductSchema, updateProductSchema } from './schema/product.schema';
import { createProductHandler, deleteProductHandler, getClusterUrlHandler, getProductHandler, updateProductHandler } from './controller/product.controller';
import {createItemsSchema} from './schema/items.schema'
import { createItemsHandler } from './controller/items.controller';
import { createTrackSchema } from './schema/track.schema';
import { createTrackByDeviceHandler, createTrackHandler, getTrackHandler } from './controller/track.controller';
function routes(app:Express){

  app.get('/',(req,res)=>{
    res.sendStatus(200);
});

    app.get('/healthcheck',( req: Request, res: Response) => {
      res.cookie("accessToken","abcdefghijklmn",{  //send accessToken in cookie
        maxAge: 90000,
        httpOnly: true,
        domain: '192.168.100.102',
        path: '/',
        sameSite: 'strict',
        secure: false
    });
      res.sendStatus(200)});


    //Users
    app.post("/api/users",[requireUser, validateResource(createUserSchema)], createUserHandler);
    app.get('/api/users', requireUser, getUsersHandler);
    app.put('/api/users', [requireUser, validateResource(updateUserSchema)], updateUserHandler);

    //Sessions
    app.post("/api/sessions", validateResource(createSessionSchema), createUserSessionHandler);

    app.get('/api/sessions', requireUser, getUserSessionsHandler);

    app.delete("/api/sessions", requireUser, deleteSessionHandler);

    //Products
    app.post(
        "/api/products",
        [requireUser, validateResource(createProductSchema)],
        createProductHandler
      );
      app.put(
        "/api/products/:productId",
        [requireUser, validateResource(updateProductSchema)],
        updateProductHandler
      );
    
      app.get(
        "/api/products/:productId",
        validateResource(getProductSchema),
        getProductHandler
      );
    
      app.delete(
        "/api/products/:productId",
        [requireUser, validateResource(deleteProductSchema)],
        deleteProductHandler
      );
    
      //Items
      app.post(
        "/api/items",
        [requireUser, validateResource(createItemsSchema)],
        createItemsHandler
      );

      //Tracks
      app.post(
        "/api/track",
        [requireUser, validateResource(createTrackSchema)],
        createTrackHandler
      );

      app.get(
        "/api/track",
        requireUser,
        getTrackHandler
      );

      app.post(
        "/api/device/:productId",
        validateResource(createTrackSchema),
        createTrackByDeviceHandler
      );
      app.get(
        "/api/device/:productId",
        getClusterUrlHandler
      );
}

export default routes;