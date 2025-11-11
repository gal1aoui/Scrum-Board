import { SetMetadata } from "@nestjs/common"
import type { UserRole } from "@scrum-board/shared"

export const Roles = (...roles: UserRole[]) => SetMetadata("roles", roles)
