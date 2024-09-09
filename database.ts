import { PrismaClient } from "@prisma/client";
import { compareHash, hashMessage } from "./utils/hashMessage";
import { sign } from "jsonwebtoken";
import { JWT_LIFETIME, JWT_SECRET } from "./constant";

export const prisma = new PrismaClient().$extends({
    query: {
        user: {
            async create({ args, query}) {
                args.data.password = await hashMessage(args.data.password);
                return query(args)
            },

            async update({ args, query }) {
                if (args.data.password !== undefined && typeof args.data.password === "string") {
                    args.data.password = await hashMessage(args.data.password);
                }
                return query(args)
            }
        }
    },
    model: {
        user: {
            async comparePassword(password: string, hashedPassword: string) {
                return await compareHash(password, hashedPassword);
            },

            async createJWT(id: number, email: string) {
                return sign(
                    {id, email},
                    JWT_SECRET,
                    {expiresIn: JWT_LIFETIME}
                )
            }
        }
    }
});