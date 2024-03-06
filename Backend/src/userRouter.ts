import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Hono } from 'hono';
import { sign } from 'hono/jwt';

export const userRoute = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_URL: string;
  };
}>();
userRoute.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const body = await c.req.json();
    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: body.password,
        name: body.name,
      },
    });
    const jwt = await sign(
      {
        id: user.id,
      },
      c.env.JWT_URL
    );
    return c.text(jwt);
  } catch (e) {
    console.log('errore detected');
    console.log(e);
    c.status(411);
    return c.text('Invalid');
  }
});

userRoute.post('/signin', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const body = await c.req.json();
    const user = await prisma.user.findUnique({
      where: {
        id: body.id,
      },
    });
    if (!user) {
      c.status(411);
      return c.text('Invalid');
    }
    const jwt = await sign({ id: user.id }, c.env.JWT_URL);
    return c.text(jwt);
  } catch (e) {
    console.log(e);
    c.status(411);
    return c.text('Invalid');
  }
});
