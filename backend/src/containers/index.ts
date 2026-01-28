import "reflect-metadata";
import { Container } from "inversify";

export const container = new Container();

import "./user.container";
import "./admin.container";
import "./nutritionist.container";
import "./common.container";
