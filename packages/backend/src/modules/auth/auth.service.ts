import { Injectable, UnauthorizedException } from "@nestjs/common"
import type { JwtService } from "@nestjs/jwt"
import type { UserService } from "../users/services/user.service"
import { UserRole } from "@scrum-board/shared"

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async register(userData: any) {
    const user = await this.userService.createUser({
      ...userData,
      role: UserRole.DEVELOPER,
    })

    const tokens = await this.generateTokens(user._id.toString())

    return {
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    }
  }

  async login(email: string, password: string) {
    const user = await this.userService.validateUser(email, password)

    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }

    const tokens = await this.generateTokens(user._id.toString())

    await this.userService.updateUser(user._id.toString(), {
      lastLoginAt: new Date(),
    } as any)

    return {
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    }
  }

  async generateTokens(userId: string) {
    const user = await this.userService.getUserById(userId)

    const payload = {
      sub: userId,
      email: user.email,
      role: user.role,
    }

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: "15m",
    })

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: "7d",
    })

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    }
  }

  async getUserProfile(userId: string) {
    return this.userService.getUserById(userId)
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token)
      return payload
    } catch (error) {
      throw new UnauthorizedException("Invalid token")
    }
  }
}
