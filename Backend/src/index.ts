import { Hono } from 'hono';
import { userRoute } from './userRouter';
import { blogRouter } from './blogRouter';
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

// signup

app.route('/api/v1/user', userRoute);
app.route('/api/v1/blog', blogRouter);

export default app;

// DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiYzYwNDkwYmYtYTc5Mi00M2QzLTliMDMtMzM5NzMzYjZjZDg4IiwidGVuYW50X2lkIjoiYjJmZTFkNjg2NjQxNTk5Mzk1NjlhYmIyOTU4ZDAzOWIyYTg2MzIxM2IxNmQ0OTUzMDk4ZDQwMTc2Y2VlMmQ1NCIsImludGVybmFsX3NlY3JldCI6IjNkMTY1MzViLTlkN2UtNDhiYS1iNDNiLTBhMjA3NDU4ODRhNyJ9.k4XntkboN0-niX0_pBnebqVBc6wBrTEIMm7VYu_NtRQ"
