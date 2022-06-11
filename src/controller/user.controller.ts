import { Request, Response } from 'express'
import { CreateUserInput } from '../schema/user.schema'
import { checkUserRole, createUser, findAndUpdateUser, findUser, findUsers } from '../service/user.service'
import logger from '../utils/logger'

export async function createUserHandler(

    req: Request <{},{}, CreateUserInput["body"]>,
    res: Response
){
    let temp = req.body
    temp.dist =  res.locals.user._id;
    try{

        const user = await createUser(temp);
        return res.send(user);
    }catch(e: any){
        logger.error(e);
        return res.sendStatus(409).send(e.message);

    }
}

export async function getUsersHandler( req: Request , res: Response ){
    let userRole = await (checkUserRole(res.locals.user.role).catch())
    if(userRole == null){
        return res.sendStatus(403);
    }

    const user = await findUsers({$or:userRole});
        return res.send(user);
    

}


export async function updateUserHandler( req: Request, res: Response){
    const userId = res.locals.user._id;
    const updatedUser = await findAndUpdateUser({ userId }, req.body, {
        new: true,
      });
    
      return res.send(updatedUser);
}