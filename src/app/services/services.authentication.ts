import jwt from "jsonwebtoken"
import configData from "../../config";


const { JWT_KEY } = configData;

export function getAuthToken(email: string, expiresIn = '7d') {
    return jwt.sign({ email }, JWT_KEY, {
        expiresIn,
    });
}

export function getPermanentAuthToken(email: string) {
    return jwt.sign({ email }, JWT_KEY);
}

export function verifyAuthToken(token: string): any {
    return jwt.verify(token, JWT_KEY);
}