import { Resume, Plans, User as PrismaUser } from "@prisma/client";

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Request {
      user?: PrismaUser;
      payload?: {
        resume?: Resume;
        plan?: Plans;
      };
    }
  }
}

export {};
