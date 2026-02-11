import { z } from 'zod';
import { 
  insertNovelSchema, 
  insertChapterSchema, 
  insertCharacterSchema, 
  insertSettingSchema,
  novels,
  chapters,
  characters,
  settings 
} from './schema';

// === SHARED ERROR SCHEMAS ===
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// === API CONTRACT ===
export const api = {
  novels: {
    list: {
      method: 'GET' as const,
      path: '/api/novels' as const,
      responses: {
        200: z.array(z.custom<typeof novels.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/novels/:id' as const,
      responses: {
        200: z.custom<typeof novels.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/novels' as const,
      input: insertNovelSchema,
      responses: {
        201: z.custom<typeof novels.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/novels/:id' as const,
      input: insertNovelSchema.partial(),
      responses: {
        200: z.custom<typeof novels.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/novels/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
    generatePlot: {
      method: 'POST' as const,
      path: '/api/novels/generate-plot' as const,
      input: z.object({
        genre: z.string(),
        theme: z.string().optional(),
      }),
      responses: {
        200: z.object({
          plot: z.string(),
          suggestedTitle: z.string(),
          characters: z.array(z.object({
            name: z.string(),
            role: z.string(),
            description: z.string(),
          })),
        }),
        500: errorSchemas.internal,
      },
    },
  },
  chapters: {
    list: {
      method: 'GET' as const,
      path: '/api/novels/:novelId/chapters' as const,
      responses: {
        200: z.array(z.custom<typeof chapters.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/chapters/:id' as const,
      responses: {
        200: z.custom<typeof chapters.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/chapters' as const,
      input: insertChapterSchema,
      responses: {
        201: z.custom<typeof chapters.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/chapters/:id' as const,
      input: insertChapterSchema.partial(),
      responses: {
        200: z.custom<typeof chapters.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/chapters/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
    reorder: {
      method: 'POST' as const,
      path: '/api/novels/:novelId/chapters/reorder' as const,
      input: z.object({
        orders: z.array(z.object({ id: z.number(), orderIndex: z.number() })),
      }),
      responses: {
        200: z.void(),
      },
    },
  },
  characters: {
    list: {
      method: 'GET' as const,
      path: '/api/novels/:novelId/characters' as const,
      responses: {
        200: z.array(z.custom<typeof characters.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/characters' as const,
      input: insertCharacterSchema,
      responses: {
        201: z.custom<typeof characters.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/characters/:id' as const,
      input: insertCharacterSchema.partial(),
      responses: {
        200: z.custom<typeof characters.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/characters/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  settings: {
    list: {
      method: 'GET' as const,
      path: '/api/novels/:novelId/settings' as const,
      responses: {
        200: z.array(z.custom<typeof settings.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/settings' as const,
      input: insertSettingSchema,
      responses: {
        201: z.custom<typeof settings.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/settings/:id' as const,
      input: insertSettingSchema.partial(),
      responses: {
        200: z.custom<typeof settings.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/settings/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
