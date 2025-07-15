import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: process.env.POSTGRES_USER! as string,
  password: process.env.POSTGRES_PASSWORD!,
  database: process.env.POSTGRES_DB!,
});

@Global()
@Module({
  providers: [
    {
      provide: 'PG_CONNECTION',
      useValue: pool,
    },
  ],
  exports: ['PG_CONNECTION'],
})
export class DatabaseModule {}
