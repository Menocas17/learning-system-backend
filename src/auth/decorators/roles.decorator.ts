import { SetMetadata } from '@nestjs/common';

//Creatring a decorator and passing the metadata necessary
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
