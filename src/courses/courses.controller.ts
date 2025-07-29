import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { addWeeks, format } from 'date-fns';
import { UpdateGradeDto } from './dto/updateGrade-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/role-guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

interface CourseData extends CreateCourseDto {
  owner_id: string;
  time_limit: string;
  is_public: boolean;
}

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  //This endpoint gets all the courses and it's mean to be only for admins
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/all-courses')
  getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  //This endpoint will get all the course for an specific user based on it's id
  @UseGuards(JwtAuthGuard)
  @Get('/my-courses')
  getAllCoursesFromUserId(@Request() req) {
    const id = req.user.userId;
    return this.coursesService.getAllCourseByUserId(id);
  }

  //This endpoint will create a new course linked to a user
  @UseGuards(JwtAuthGuard)
  @Post('/create-course')
  createCourse(@Body() course: CreateCourseDto, @Request() req) {
    const addThreeWeeks = addWeeks(new Date(), 3);
    const time_limit = format(addThreeWeeks, 'yyyy-MM-dd HH:mm:ss.SSS');

    const id = req.user.userId;

    return this.coursesService.createCourse({
      ...course,
      owner_id: id,
      time_limit: time_limit,
    });
  }

  // This endpoint will update a course by the id
  @UseGuards(JwtAuthGuard)
  @Put('/update-course/:id')
  async updateCourseById(
    @Param('id') id: string,
    @Body() updateData: UpdateCourseDto,
    @Request() req,
  ) {
    const title = updateData.title || null;
    const description = updateData.description || null;

    const courseInfo = await this.coursesService.courseInfoById(id);

    // If the user id is not the same that the owner id will not let you update, this is to increase the security in the api
    if (courseInfo.owner_id !== req.user.userId)
      throw new UnauthorizedException('You are not the owner of the course');

    return this.coursesService.updateCourse(title, description, id);
  }

  // This endpoint wil only updat the grade in the course
  @UseGuards(JwtAuthGuard)
  @Put('/update-grade/:id')
  async updateGrade(
    @Param('id') id: string,
    @Body() grade: UpdateGradeDto,
    @Request() req,
  ) {
    const courseInfo = await this.coursesService.courseInfoById(id);

    // The endpoint will let you update the grade if you are an admin otherwise if you do not own the course will not be able to get the grade updated
    if (courseInfo.owner_id !== req.user.userId && req.user.role !== 'admin') {
      throw new UnauthorizedException('You are not the owner of the course');
    }
    return this.coursesService.udpateGrade(grade.grade, id);
  }

  //This endpoint will let you delete the course
  @UseGuards(JwtAuthGuard)
  @Delete('delete-course/:id')
  async deleteCourse(@Param('id') id: string, @Request() req) {
    const courseInfo = await this.coursesService.courseInfoById(id);

    // The endpoint will let you delete the course if you are an admin otherwise if you do not own the course will not be able to deleted
    if (courseInfo.owner_id !== req.user.userId && req.user.role !== 'admin')
      throw new UnauthorizedException('You are not the owner of the course');

    const deletedCourse = await this.coursesService.deleteCourse(id);

    return {
      message: 'Course deleted succesfully',
      course: deletedCourse,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/public_courses')
  async getPublicCourses() {
    return this.coursesService.getAllPublicCourses();
  }
}
