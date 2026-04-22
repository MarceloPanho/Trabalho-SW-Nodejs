export function errorHandler(err, req, res, next) {
  const statusMap = {
    ValidationError: 400,
    UnauthorizedError: 401,
    ForbiddenError: 403,
    NotFoundError: 404,
    ConflictError: 409,
  };

  const status = statusMap[err.name] ?? 500;
  const message = status === 500 ? 'Erro interno do servidor' : err.message;

  if (status === 500) {
    console.error('[ERROR]', err);
  }

  return res.status(status).json({ error: message });
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Não autorizado') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Acesso negado') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Recurso não encontrado') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  constructor(message = 'Conflito de dados') {
    super(message);
    this.name = 'ConflictError';
  }
}
