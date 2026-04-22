import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Habit Tracker API',
      version: '1.0.0',
      description: 'API RESTful para registro de hábitos e execuções diárias',
    },
    servers: [
      {
        url: 'http://localhost:{port}',
        variables: {
          port: { default: '3000' },
        },
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      parameters: {
        habitId: {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' },
          description: 'ID do hábito',
        },
      },
      schemas: {
        UserPublic: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'Alice Silva' },
            email: { type: 'string', format: 'email', example: 'alice@exemplo.com' },
          },
        },
        Habit: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            title: { type: 'string', example: 'Meditar' },
            description: { type: 'string', example: '10 minutos pela manhã', nullable: true },
            frequency: { type: 'string', enum: ['DAILY', 'WEEKLY'], example: 'DAILY' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        HabitInput: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', example: 'Meditar' },
            description: { type: 'string', example: '10 minutos pela manhã' },
            frequency: { type: 'string', enum: ['DAILY', 'WEEKLY'], default: 'DAILY' },
          },
        },
        HabitLog: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            habitId: { type: 'string', format: 'uuid' },
            date: { type: 'string', format: 'date-time' },
            note: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        HabitLogInput: {
          type: 'object',
          required: ['date'],
          properties: {
            date: { type: 'string', format: 'date', example: '2025-04-17' },
            note: { type: 'string', example: 'Consegui completar os 10 minutos!' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Mensagem de erro legível' },
          },
        },
      },
      responses: {
        BadRequest: {
          description: 'Dados inválidos ou ausentes',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/Error' } },
          },
        },
        Unauthorized: {
          description: 'Token ausente ou inválido',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/Error' } },
          },
        },
        Forbidden: {
          description: 'Recurso não pertence ao usuário',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/Error' } },
          },
        },
        NotFound: {
          description: 'Recurso não encontrado',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/Error' } },
          },
        },
        Conflict: {
          description: 'Conflito — recurso já existe',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/Error' } },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Registro e login de usuários' },
      { name: 'Habits', description: 'Gerenciamento de hábitos' },
      { name: 'HabitLogs', description: 'Registro de execuções de hábitos' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
