import { prisma } from '../lib/prisma.js';

export const habitRepository = {
  findAllByUser(userId) {
    return prisma.habit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  findById(id) {
    return prisma.habit.findUnique({ where: { id } });
  },

  create(data) {
    return prisma.habit.create({ data });
  },

  update(id, data) {
    return prisma.habit.update({ where: { id }, data });
  },

  delete(id) {
    return prisma.habit.delete({ where: { id } });
  },
};
