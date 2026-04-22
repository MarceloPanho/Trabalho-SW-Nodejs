import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository.js';
import { ValidationError, ConflictError, UnauthorizedError } from '../middlewares/errorHandler.js';

export const authService = {
  async register({ name, email, password }) {
    if (!name || !email || !password) {
      throw new ValidationError('Campos name, email e password são obrigatórios');
    }

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new ConflictError('E-mail já cadastrado');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ name, email, passwordHash });

    return { id: user.id, name: user.name, email: user.email };
  },

  async login({ email, password }) {
    if (!email || !password) {
      throw new ValidationError('Campos email e password são obrigatórios');
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
    });

    return { token };
  },
};
