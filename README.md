# 📘 Overview

## Learning System API

This API was designed and built to provide the back-end functionalities of a learning management system. It allows users to create accounts and track the courses in which they are enrolled.

The platform promotes self-learning — as the user, you are responsible for adding the courses you're interested in. The system provides tools to support your learning journey, such as tracking grades, managing quizzes, and more. Each user has a unique account and personalized course list. After creating an account, you can add, update, or delete courses, and use the grade tracking system to monitor your progress.

---

# ⚠️ Important

This API is still under development. Some features — such as quizzes, topics, and subtopics — are not yet implemented.

---

# 🎯 Purpose

I created this API as a learning project to deepen my understanding of SQL and PostgreSQL. It also gave me the opportunity to practice using back-end frameworks like **Express** and **NestJS**.

[🖥️ Software Demo Video](https://youtu.be/lpMfDCBTFMk)

---

# 🗃️ Relational Database

I’m using **PostgreSQL** for the relational database. Instead of installing it directly on my system, I set it up using a Docker container for easier debugging and faster setup.

### 🧱 Database Structure

The database contains four main tables:

- `users`
- `courses`
- `topics`
- `subtopics`

Each user has an account and can own multiple courses. A course belongs to **one user** only. The same logic applies to topics and subtopics — a course can have many topics, and each topic can have multiple subtopics. All relationships follow a **one-to-many** structure.

Each table contains specific columns according to its context. Notably, each course and topic includes a **due date** (`limit date`). After this date, when quizzes are completed, the grade assigned will be **reduced** to reflect the delay.

---

# 🛠️ Development Environment

### Tools Used

- **VS Code** – Code editor
- **Docker** – To run PostgreSQL in a container
- **pgAdmin 4** – For managing the database via UI
- **Warp / iTerm / Terminal** – For CLI operations
- **Yaak** – REST client to test endpoints

### Technologies

- **Node.js** – JavaScript runtime for development
- **NestJS** – Back-end framework using **TypeScript**
- **PostgreSQL** – Relational database
- **SQL** – For managing queries and schemas

### Libraries and Packages

- **bcrypt** – For hashing user passwords
- **passport** – Authentication and authorization
- **dotenv** – To manage environment variables securely

---

# 🔗 Useful Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [YouTube – NestJS Tutorial](https://www.youtube.com/watch?v=Fe0hWZ_mjy8)

---

# 🚧 Future Work

- Implement full functionality for `topics` and `subtopics` endpoints
- Integrate **OAuth** to improve the login experience
- Add the `quizzes` table and implement related API endpoints
