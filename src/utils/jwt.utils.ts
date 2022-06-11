import jwt from 'jsonwebtoken'
import config from 'config'
import { isUndefined } from 'lodash';

const privateKey = config.get<string>('privateKey');
const publicKey = config.get<string>('publicKey');

//sign jwt token
export function signJwt(
    object: object,
    options?: jwt.SignOptions | undefined
){
    try{
        return jwt.sign(object, privateKey, {
            ...(options && options),
            algorithm: 'RS256'
        });
    }catch(e: any){

        return e;
    }
}

//verify jwt token
export function verifyJwt(token: string){
    try{
        
        const decoded = jwt.verify(token,publicKey);
        return {
            valid: false,
            expired: false,
            decoded
        }
    }catch(e: any){
        return {
            valid: false,
            expired: true,
            decoded: null
        }
    }
}

