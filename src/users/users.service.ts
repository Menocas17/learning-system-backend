import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { isEmail } from 'validator';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@Inject('PG_CONNECTION') private readonly db: Pool) {}

  //Getting all the users in the database (admins only)
  async findAll() {
    try {
      const result = await this.db.query('SELECT * FROM users');

      if (result.rows.length === 0)
        throw new NotFoundException(
          'Looks like there is no users in the database. Try creating a new one.',
        );

      return result.rows;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException(err.message);
    }
  }

  // Getting a user info by it's id, this will normally be used in the front when the user visit the profile page.
  async findById(id: string) {
    try {
      const result = await this.db.query(`SELECT * FROM users WHERE id = $1`, [
        id,
      ]);

      if (result.rows.length === 0)
        throw new NotFoundException(`There is no user with id : ${id}`);

      return result.rows[0];
    } catch (err) {
      if (err instanceof NotFoundException) throw err;

      throw new InternalServerErrorException(err.message);
    }
  }

  //function to hash the password when creating or updatign the user
  async hashPassword(plainPassword: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
  }

  //Creating a new user
  async createUser(name: string, email: string, password_plain: string) {
    const password_hash = await this.hashPassword(password_plain);

    try {
      const result = await this.db.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
        [name, email, password_hash],
      );

      return result.rows[0];
    } catch (err) {
      // PostgreSQL error code 23505 = unique_violation
      if (err.code === '23505') {
        throw new ConflictException('The email is already registered');
      }
      throw new InternalServerErrorException(err.message);
    }
  }

  // updating a user
  async updateUser(
    name: string | null,
    email: string | null,
    password_plain: string | null,
    id: string,
  ) {
    try {
      let password_hash: string | null = null;

      if (password_plain) {
        password_hash = await this.hashPassword(password_plain!);
      }

      const result = await this.db.query(
        `UPDATE users
            SET
                name = COALESCE($1, name),
                email = COALESCE($2, email),
                password_hash = COALESCE($3, password_hash)
            WHERE id = $4
            RETURNING *

        `,
        [name, email, password_hash, id],
      );
      return result.rows[0];
    } catch (err) {
      // PostgreSQL error code 23505 = unique_violation
      if (err.code === '23505') {
        throw new ConflictException('The email is already registered');
      }
      throw new InternalServerErrorException(err.message);
    }
  }

  //deleting a user by it's id
  async deleteUser(id: string) {
    try {
      const result = await this.db.query(
        'DELETE FROM users WHERE id = $1 RETURNING *',
        [id],
      );

      if (result.rows.length === 0)
        throw new NotFoundException(
          'The user was not found or is already deleted.',
        );

      return result.rows[0];
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException(err.message);
    }
  }

  //getting a user by it's email address
  async getUserByEmail(email: string) {
    if (!isEmail(email))
      throw new BadRequestException('Email address is not valid');

    try {
      const result = await this.db.query(
        'SELECT * FROM users WHERE email = $1',
        [email],
      );

      if (result.rows.length === 0)
        throw new NotFoundException('There is no user with that email address');

      return result.rows[0];
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException(err.message);
    }
  }
}
