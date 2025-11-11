import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { JwtStrategy } from "./jwt.strategy"
import { UserService } from "../users/services/user.service"
import { UserRepository } from "../users/repositories/user.repository"

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-secret-key",
      signOptions: { expiresIn: "15m" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserService, UserRepository],
  exports: [AuthService],
})
export class AuthModule {}
