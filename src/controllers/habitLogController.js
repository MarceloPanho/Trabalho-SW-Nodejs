import { habitLogService } from '../services/habitLogService.js';

export const habitLogController = {
  async list(req, res, next) {
    try {
      const logs = await habitLogService.listByHabit(req.params.id, req.userId);
      res.json(logs);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const log = await habitLogService.create(req.params.id, req.userId, req.body);
      res.status(201).json(log);
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await habitLogService.delete(req.params.id, req.userId, req.params.logId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
