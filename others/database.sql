-- This is the scheme for the learning system

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'student', -- 'student', 'admin'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TYPE course_level AS ENUM ('begginer', 'intermidium', 'advance');

-- Courses (these are related with users)
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  grade DEFAULT 0, 
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  time_limit TIMESTAMP
);

-- Topics per course
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  level course_level NOT NULL DEFAULT 'begginer',
  notes TEXT,
  completed BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  time_limit TIMESTAMP
);

CREATE TABLE subtopics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  sources TEXT[],
  completed BOOLEAN
);

ALTER TABLE courses
ALTER COLUMN grade SET DEFAULT 0;


-- docker-compose up --build. to rebuild de docker container