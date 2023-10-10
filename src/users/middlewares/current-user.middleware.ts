// import { Injectable, NestMiddleware } from "@nestjs/common";
// import { UserEntity } from "../entity/user.entity";
// import { UsersService } from "../users.service";
// import { NextFunction, Request } from "express";

// declare global {
//     namespace Express {
//         interface Request {
//             currentUser?: UserEntity;
//         }
//     }
// }

// @Injectable()
// export class CurrentUserMiddleware implements NestMiddleware {
//   constructor(private usersService: UsersService) {}
//   async use(req: Request, res: Response, next: NextFunction) {
//     const { userId } = req.session || {};

//     if (userId) {
//       const user = await this.usersService.findOneUser(userId);
//       req.currentUser = user;
//     }

//     next();
//   }
// }
