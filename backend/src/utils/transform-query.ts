import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { Request } from "express";

import { PublicPostListQueryDTO } from "../dtos/public/post/public-post-list-query.dto";

export const transformPublicPostQuery = async (req: Request) => {
  const query = plainToInstance(PublicPostListQueryDTO, req.query, {
    enableImplicitConversion: true,
  });

  await validateOrReject(query);

  return query;
};
