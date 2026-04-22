import { prisma } from '../lib/prisma.js';

export const habitLogRepository = {
  findAllByHabit(habitId) {
    return prisma.habitLog.findMany({
      where: { habitId },
      orderBy: { date: 'desc' },
    });
  },

  findById(id) {
    return prisma.habitLog.findUnique({ where: { id } });
  },

  findByHabitAndDate(habitId, date) {
    return prisma.habitLog.findUnique({
      where: { habitId_date: { habitId, date } },
    });
  },

  create(data) {
    return prisma.habitLog.create({ data });
  },

  delete(id) {
    return prisma.habitLog.delete({ where: { id } });
  },
};
