import { NextFunction, Request, Response } from 'express';

import { ERROR_CODES } from '../constants/statusCode';
import { TRole } from '../types/auth/types';

const privilege =
  (roles: TRole[]) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const role: TRole = req.body.role ?? req.body.data.role;
      if (roles.includes(role) === false) throw new Error();
      return next();
    } catch (error) {
      return res
        .status(ERROR_CODES.FORBIDDEN)
        .json({ message: 'You are not permitted to access this route.' });
    }
  };
export default privilege;
