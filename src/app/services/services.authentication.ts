import jwt from "jsonwebtoken"
import configData from "../../config";


const { JWT_KEY } = configData;

export function getAuthToken(userId: object, expiresIn = '7d') {
    return jwt.sign({ userId }, JWT_KEY, {
        expiresIn,
    });
}

export function getPermanentAuthToken(userId: object) {
    return jwt.sign({ userId }, JWT_KEY);
}

export function verifyAuthToken(token: string): any {
    return jwt.verify(token, JWT_KEY);
}