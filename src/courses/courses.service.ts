import {
  Injectable,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

interface CourseData extends CreateCourseDto {
  owner_id: string;
  time_limit: string;
}

@Injectable()
export class CoursesService {
  constructor(@Inject('PG_CONNECTION') private readonly db: Pool) {}

  //Getting all the course related to a user
  async getAllCourseByUserId(id: string) {
    try {
      const result = await this.db.query(
        'SELECT * FROM courses WHERE owner_id = $1',
        [id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`There are no courses for id: ${id}`);
      }

      return result.rows;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException(err.message);
    }
  }

  //Get all courses in the database (admins only)
  async getAllCourses() {
    try {
      const result = await this.db.query(
        'SELECT c.*, u.name AS owner_name FROM courses c JOIN users u ON c.owner_id = u.id',
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(
          'There are no courses at this moment. Add a new course.',
        );
      }

      return result.rows;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException(err.message);
    }
  }

  // Creating a new course
  async createCourse(courseData: CourseData) {
    try {
      const result = await this.db.query(
        'INSERT INTO courses (title, description, owner_id, time_limit) VALUES ($1, $2, $3, $4) RETURNING *',
        [
          courseData.title,
          courseData.description,
          courseData.owner_id,
          courseData.time_limit,
        ],
      );

      return result.rows[0];
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  //Updating the course title and description
  async updateCourse(
    title: string | null,
    description: string | null,
    id: string,
  ) {
    try {
      const result = await this.db.query(
        'UPDATE courses SET title = COALESCE($1, title), description = COALESCE($2, description) WHERE id = $3 RETURNING *',
        [title, description, id],
      );

      return result.rows[0];
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  //Get info from a course based on it's id

  async courseInfoById(id: string) {
    try {
      const result = await this.db.query(
        'SELECT * FROM courses WHERE id = $1',
        [id],
      );

      if (result.rows.length === 0)
        throw new NotFoundException('The course was not found in the database');

      return result.rows[0];
    } catch (err) {
      if (err instanceof NotFoundException) throw err;

      throw new InternalServerErrorException(err.message);
    }
  }

  //Updating the grade for a course
  async udpateGrade(grade: number, id: string) {
    try {
      const result = await this.db.query(
        'UPDATE courses SET grade = $1 WHERE id = $2 RETURNING grade, title',
        [grade, id],
      );

      return result.rows[0];
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  //Deleting a course by it's id
  async deleteCourse(id: string) {
    try {
      const result = await this.db.query(
        'DELETE FROM courses WHERE id=$1 RETURNING *',
        [id],
      );

      if (result.rows.length === 0)
        throw new NotFoundException(
          'The courses you are trying to delete was not found or is already deleted.',
        );

      return result.rows[0];
    } catch (err) {
      if (err instanceof NotFoundException) throw err;

      throw new InternalServerErrorException(err.message);
    }
  }
}
