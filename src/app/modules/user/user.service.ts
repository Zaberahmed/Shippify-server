import User, { IUser } from "./user.model";

export const createUserToDB = async (userData: any): Promise<IUser> => {
    try {
        const user = new User(userData);
        await user.save();
        return user;
    } catch (err) {
        throw err;
    }
}

export const getUserByEmailFromDB = async (payload: string): Promise<IUser> => {
    try {
        const user = await User.findOne({ email: payload });
        return user as IUser;
    } catch (err) {
        throw err;
    }
}

export const getUserByIdFromDB = async (payload: string): Promise<IUser> => {
    try {
        const user = await User.findOne({ _id: payload });
        return user as IUser;
    } catch (err) {
        throw err;
    }
}

export const updateUserByIdFromDB = async (payload: any): Promise<IUser> => {
    try {
        console.log(payload.updateFields);
        const user = await User.findByIdAndUpdate({ _id: payload?.userId }, { $set: payload.updateFields }, { new: true });
        console.log(user);
        return user as IUser;
    } catch (err) {
        throw err;
    }
}