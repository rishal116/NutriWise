import { Request, Response } from "express";
import { IUserAuthService } from "../../../services/user/interface/IUserAuthService";
import { IUserAuthController } from "../interface/IUserAuthController";

export class UserAuthController implements IUserAuthController {
  constructor(private userAuthService: IUserAuthService) {}

  async signup(req: Request, res: Response): Promise<void> {
    const result = await this.userAuthService.signup(req.body);
    res.status(201).json(result);
  }

  async signin(req: Request, res: Response): Promise<void> {
    const result = await this.userAuthService.signin(req.body);
    res.status(200).json(result);
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    const result = await this.userAuthService.verifyOtp(req.body);
    res.status(200).json(result);
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const result = await this.userAuthService.forgotPassword(req.body.email);
    res.status(200).json(result);
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const result = await this.userAuthService.resetPassword(req.body);
    res.status(200).json(result);
  }
}
