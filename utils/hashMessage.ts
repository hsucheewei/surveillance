import { compare, genSalt, hash } from "bcrypt";
import { SALT_ROUNDS } from "../constant";

export async function hashMessage(secret: string) {
    const salt = await genSalt(SALT_ROUNDS);
    const hashedSecret = await hash(secret, salt);
    return hashedSecret
}   

export async function compareHash(message: string, hashedMessage: string) {
    const isMatch = await compare(message, hashedMessage);
    return isMatch
}