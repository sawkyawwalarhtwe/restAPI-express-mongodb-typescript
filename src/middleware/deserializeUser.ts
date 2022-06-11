import {get} from 'lodash';
import { Request, Response, NextFunction} from 'express';
import { verifyJwt } from '../utils/jwt.utils';
import { reIssuseAccessToken } from '../service/session.service';
import config from 'config';
const deserializeUser = async ( req: Request, res: Response, next: NextFunction) => {
    const accessToken = get(req, "cookies.accessToken") || get(req, "headers.authorization", "").replace(/^Bearer\s/, "");
    const refreshToken = get(req, "cookies.refreshToken") || get(req, "headers.x-refresh");
    const host = config.get<string>("host");
    
    const {decoded,expired} = verifyJwt(accessToken);
    if(accessToken){
       
    if(decoded){
        res.locals.user = decoded;
        return next();
    }

    
        
    }
    if(expired && refreshToken){
        const newAccessToken = await reIssuseAccessToken({refreshToken});
        if(newAccessToken){
            res.setHeader('x-access-token', newAccessToken);
            res.cookie("accessToken",newAccessToken,{  //send accessToken in cookie
                maxAge: 90000,
                httpOnly: true,
                domain: host,
                path: '/',
                sameSite: 'strict',
                secure: false
            });
            res.cookie("refreshToken",refreshToken,{  //send accessToken in cookie
                maxAge: 3.154e10,
                httpOnly: true,
                domain: host,
                path: '/',
                sameSite: 'strict',
                secure: false
            });
        }

        const result = verifyJwt(newAccessToken)

        res.locals.user = result.decoded;
        return next();
    }

    return next();
};

export default deserializeUser;