import { Request, Response, NextFunction } from "express";
import { verifyAuthToken } from "../services/services.authentication";
import { verifyFirebaseToken } from "../services/admin.firebase";
import { getUserByEmailFromDB } from "../modules/user/user.service";

// interface RequestWithAuthUser extends Request {
//     authUser: number
// }

// {
//     name: 'Tonmoy Kumar Roy',
//     picture: 'https://lh3.googleusercontent.com/a/ACg8ocKGNGJGOSdZ8NSNvRiCuI4ms3P7WBuAZZb0SOMru4aHG4Y=s96-c',
//     iss: 'https://securetoken.google.com/test-authentication-398607',
//     aud: 'test-authentication-398607',
//     auth_time: 1695044646,
//     user_id: 'zCur4nls3HMHiip6NrIwEqAwuz12',
//     sub: 'zCur4nls3HMHiip6NrIwEqAwuz12',
//     iat: 1695044646,
//     exp: 1695048246,
//     email: 'tonmoykumarroy6@gmail.com',
//     email_verified: true,
//     firebase: {
//       identities: { 'google.com': [Array], email: [Array] },
//       sign_in_provider: 'google.com'
//     },
//     uid: 'zCur4nls3HMHiip6NrIwEqAwuz12'
//   }

export async function authentication(req: Request | any, res: Response, next: NextFunction) {
    try {
        // const token = req.headers['x-auth-token'];
        const token = req.headers['x-auth-token'];
        // const token = req.header('Authorization').split('Bearer ')[1];

        const gVerified = await verifyFirebaseToken(token);

        if (gVerified?.email) {
            let googleUser = await getUserByEmailFromDB(gVerified.email);
            req.authUser = googleUser?._id;
        } else {
            const verified = verifyAuthToken(token);
            if (verified) {
                req.authUser = verified?.userId;
            }
            if (!verified) return res.status(401).json('You are not Authorized');
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

export async function googleAuthentication(req: Request | any, res: Response, next: NextFunction) {
    try {
        const token = req.headers['x-auth-token'];
        // const token = req.header('Authorization').split('Bearer ')[1];

        const gVerified = await verifyFirebaseToken(token);

        if (gVerified?.email) {
            req.body = gVerified;
        } else {
            return res.status(401).json('You are not Authorized');
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

