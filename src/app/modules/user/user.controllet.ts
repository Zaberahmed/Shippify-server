import { checkPassword, encryptPassword } from '../../services/services.password';
import express, { Request, Response, NextFunction } from "express";
import { createUserToDB, getUserByEmailFromDB, getUserByIdFromDB, updateUserByIdFromDB } from "./user.service";
import redis from '../../services/services.redis';
import { sendOTP } from '../../services/services.mailer';
import { getAuthToken } from '../../services/services.authentication';

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

export const registerByGoogle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, uid, name } = req.body;

        const alreadyHave = await getUserByEmailFromDB(email);
        if (alreadyHave) {
            return res.status(302).json({
                status: "error",
                error: "Email Already Exist"
            })
        }

        const confirmData = {
            name: name,
            email: email,
            password: uid,
        }
        const userData = await createUserToDB(confirmData);

        return res.status(200).json({
            status: "success",
            data: "User Created by google auth",
            user: userData
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            error
        })
    }
}

export const registerRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const alreadyHave = await getUserByEmailFromDB(email);
        if (alreadyHave) {
            return res.status(302).json({
                status: "error",
                error: "Email Already Exist"
            })
        }

        let encPassword = await encryptPassword(password);
        req.body.password = encPassword;

        const code = Math.floor(Math.random() * 899999 + 100000);
        // console.log(code);
        let data = await redis.set(`${code}`, JSON.stringify(req.body), { EX: 180 });
        // let data = await redis.setEx('tonmoy', 10, 'kumar');

        if (data === "OK") {
            sendOTP(req.body.email, code);
            return res.status(200).json({
                status: "success",
                data: "Check your mail & confirm by submitting your OTP",
                opt: code
            })
        } else {
            throw "Something wrong";
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            error
        })
    }
}

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await redis.get(`${req.body.code}`);

        if (!data) {
            throw "OTP not match";
        }

        const confirmData = JSON.parse(data as string);
        const userData = await createUserToDB(confirmData);
        const token = getAuthToken(userData._id);

        return res.status(200).json({
            status: "success",
            token: token,
            data: userData
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            error
        })
    }
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // console.log(req.body);
        const { email, password } = req.body;
        if (!email || !password) throw "credential not fulfilled"

        const userData = await getUserByEmailFromDB(email);
        if (!userData) throw new Error("email not exist");

        let isVerified = await checkPassword(password, userData.password);

        if (!isVerified) {
            return res.status(301).json({
                status: "error",
                error: "Authentication Error"
            })
        }
        const token = getAuthToken(userData._id)
        return res.status(200).json({
            status: "success",
            token: token,
            data: userData
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            error
        })
    }
}

export const getUserByToken = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const user = await getUserByIdFromDB(req.authUser);
        return res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            error
        })
    }
}

export const updateUserByToken = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const { _id, name, email, password, selectedCarriers, shipments, ...rest } = req.body;

        const payload = {
            userId: req.authUser,
            updateFields: rest
        }

        const user = await updateUserByIdFromDB(payload);
        return res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            error
        })
    }
}