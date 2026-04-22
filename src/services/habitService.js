import { habitRepository } from '../repositories/habitRepository.js';
import { ValidationError, ForbiddenError, NotFoundError } from '../middlewares/errorHandler.js';

const VALID_FREQUENCIES = ['DAILY', 'WEEKLY'];

async function assertOwnership(habitId, userId) {
  const habit = await habitRepository.findById(habitId);
  if (!habit) throw new NotFoundError('Hábito não encontrado');
  if (habit.userId !== userId) throw new ForbiddenError('Este hábito não pertence ao usuário autenticado');
  return habit;
}

export const habitService = {
  listByUser(userId) {
    return habitRepository.findAllByUser(userId);
  },

  async create(userId, { title, description, frequency }) {
    if (!title) throw new ValidationError('Campo title é obrigatório');
    if (frequency && !VALID_FREQUENCIES.includes(frequency)) {
      throw new ValidationError('frequency deve ser DAILY ou WEEKLY');
    }

    return habitRepository.create({ userId, title, description, frequency: frequency ?? 'DAILY' });
  },

  async getById(habitId, userId) {
    return assertOwnership(habitId, userId);
  },

  async update(habitId, userId, { title, description, frequency }) {
    await assertOwnership(habitId, userId);

    if (frequency && !VALID_FREQUENCIES.includes(frequency)) {
      throw new ValidationError('frequency deve ser DAILY ou WEEKLY');
    }

    return habitRepository.update(habitId, { title, description, frequency });
  },

  async delete(habitId, userId) {
    await assertOwnership(habitId, userId);
    return habitRepository.delete(habitId);
  },
};
