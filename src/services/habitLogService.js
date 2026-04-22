import { habitRepository } from '../repositories/habitRepository.js';
import { habitLogRepository } from '../repositories/habitLogRepository.js';
import { ValidationError, ForbiddenError, NotFoundError, ConflictError } from '../middlewares/errorHandler.js';

async function assertHabitOwnership(habitId, userId) {
  const habit = await habitRepository.findById(habitId);
  if (!habit) throw new NotFoundError('Hábito não encontrado');
  if (habit.userId !== userId) throw new ForbiddenError('Este hábito não pertence ao usuário autenticado');
  return habit;
}

export const habitLogService = {
  async listByHabit(habitId, userId) {
    await assertHabitOwnership(habitId, userId);
    return habitLogRepository.findAllByHabit(habitId);
  },

  async create(habitId, userId, { date, note }) {
    await assertHabitOwnership(habitId, userId);

    if (!date) throw new ValidationError('Campo date é obrigatório');

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new ValidationError('date deve estar no formato ISO 8601 (ex: 2025-04-17)');
    }

    parsedDate.setHours(0, 0, 0, 0);

    const existing = await habitLogRepository.findByHabitAndDate(habitId, parsedDate);
    if (existing) {
      throw new ConflictError('Já existe um log para este hábito nesta data');
    }

    return habitLogRepository.create({ habitId, date: parsedDate, note });
  },

  async delete(habitId, userId, logId) {
    await assertHabitOwnership(habitId, userId);

    const log = await habitLogRepository.findById(logId);
    if (!log) throw new NotFoundError('Log não encontrado');
    if (log.habitId !== habitId) throw new ForbiddenError('Este log não pertence ao hábito informado');

    return habitLogRepository.delete(logId);
  },
};
