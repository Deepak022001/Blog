import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Hono } from 'hono';
import { verify } from 'hono/jwt';
export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

// middleware
blogRouter.use('/*', async (c, next) => {
  const authHeader = c.req.header('authorization') || '';
  const user = await verify(authHeader, c.env.JWT_SECRET);
  if (user) {
    c.set('userId', user.id);
    await next();
  } else {
    c.status(403);
    return c.json({
      message: 'You are not logged in',
    });
  }
});

blogRouter.post('/', async (c) => {
  const body = await c.req.json();
  const authorId = c.get('userId');
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: Number(authorId),
      },
    });
    return c.json({
      id: blog.id,
    });
  } catch (e) {
    c.status(500);
    return c.json({ error: 'Internal Server Error' });
  }
});

blogRouter.put('/', async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const blog = await prisma.blog.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
        authorId: 1,
      },
    });
    return c.json({
      id: blog.id,
    });
  } catch (e) {
    c.status(500);
    return c.json({ error: 'Internal Server Error' });
  }
});

blogRouter.get('/:id', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const id = await c.req.param('id');
    const blog = await prisma.blog.findFirst({
      where: {
        id: Number(id),
      },
    });
    return c.json({
      blog,
    });
  } catch (e) {
    c.status(411);
    return c.json({ error: 'Internal Server Error' });
  }
});

blogRouter.get('/bulk', (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const blogs = prisma.blog.findMany();
  return c.json({
    blogs,
  });
});
