import { habitService } from '../services/habitService.js';

export const habitController = {
  async list(req, res, next) {
    try {
      const habits = await habitService.listByUser(req.userId);
      res.json(habits);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const habit = await habitService.create(req.userId, req.body);
      res.status(201).json(habit);
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const habit = await habitService.getById(req.params.id, req.userId);
      res.json(habit);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const habit = await habitService.update(req.params.id, req.userId, req.body);
      res.json(habit);
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await habitService.delete(req.params.id, req.userId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
