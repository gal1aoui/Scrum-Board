import { Controller, Post, UseGuards, Get } from "@nestjs/common"
import type { AuthService } from "./auth.service"
import { JwtGuard } from "../../common/guards/jwt.guard"
import { CurrentUser } from "../../common/decorators/current-user.decorator"
import { userRegisterSchema, userLoginSchema } from "@scrum-board/shared"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(body: unknown) {
    const validatedData = userRegisterSchema.parse(body)
    return this.authService.register(validatedData)
  }

  @Post("login")
  async login(body: unknown) {
    const validatedData = userLoginSchema.parse(body)
    return this.authService.login(validatedData.email, validatedData.password)
  }

  @Post('refresh')
  @UseGuards(JwtGuard)
  async refreshToken(@CurrentUser('_id') userId: string) {
    return this.authService.generateTokens(userId);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async getCurrentUser(@CurrentUser() user: any) {
    return this.authService.getUserProfile(user._id);
  }
}
