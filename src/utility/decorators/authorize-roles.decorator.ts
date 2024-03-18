import { SetMetadata } from '@nestjs/common';

export const ALLOWED_ROLES = 'allowed_roles';

export const Role = (...roles: string[]) => SetMetadata(ALLOWED_ROLES, roles);
