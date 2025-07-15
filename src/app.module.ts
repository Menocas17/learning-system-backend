import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [UsersModule, CoursesModule, AuthModule, DatabaseModule],
})
export class AppModule {}
