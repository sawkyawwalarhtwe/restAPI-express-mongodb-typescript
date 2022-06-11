import config from 'config';
import {Request, Response} from 'express'
import { createSession, findSessions, updateSession } from '../service/session.service';
import { validatePassword } from '../service/user.service'
import { signJwt } from '../utils/jwt.utils';
export async function createUserSessionHandler(req: Request, res: Response){
    const host = config.get<string>("host");
    //validate user password
    const user = await validatePassword(req.body);
    if(!user){
        return res.status(401).send("invalid email or password"); // password or email is invalid
    }

    //create session

    const session = await createSession(user._id, req.get("user-agent") || " ");
    const accessToken = signJwt({
        ...user, session: session._id,},
        {expiresIn: config.get("accessTokenTtl") });
    
    const refreshToken = signJwt({
        ...user, session: session._id,},
        {expiresIn: config.get("refreshTokenTtl") });
        res.cookie("refreshToken",refreshToken,{     //send refreshToken in cookie
            maxAge: 3.154e10,
            httpOnly: true,             //can only access by http not by javascript
            domain: host,      //should store in config file for production use
            path: '/',
            sameSite: 'strict',         
            secure: false               //secure false for http request
        })
        res.cookie("accessToken",accessToken,{  //send accessToken in cookie
            maxAge: 90000,
            httpOnly: true,
            domain: host,
            path: '/',
            sameSite: 'strict',
            secure: false
        });

    return res.send({accessToken, refreshToken});
    
}

export async function getUserSessionsHandler( req: Request , res: Response ){
    const userId = res.locals.user._id;
    const sessions = await findSessions({user: userId, valid: true});

    return res.send(sessions);

}

export async function deleteSessionHandler(req: Request, res: Response) {
    const sessionId = res.locals.user.session;
    
    await updateSession({ _id: sessionId }, { valid: false });
  
    return res.send({
      accessToken: null,
      refreshToken: null,
    });
  }