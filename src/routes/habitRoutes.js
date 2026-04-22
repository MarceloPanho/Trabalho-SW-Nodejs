import { Router } from 'express';
import { habitController } from '../controllers/habitController.js';
import { habitLogController } from '../controllers/habitLogController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /habits:
 *   get:
 *     tags: [Habits]
 *     summary: Lista todos os hábitos do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de hábitos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Habit'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', habitController.list);

/**
 * @openapi
 * /habits:
 *   post:
 *     tags: [Habits]
 *     summary: Cria um novo hábito
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HabitInput'
 *     responses:
 *       201:
 *         description: Hábito criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habit'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/', habitController.create);

/**
 * @openapi
 * /habits/{id}:
 *   get:
 *     tags: [Habits]
 *     summary: Retorna um hábito pelo ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/habitId'
 *     responses:
 *       200:
 *         description: Hábito encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habit'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', habitController.getById);

/**
 * @openapi
 * /habits/{id}:
 *   put:
 *     tags: [Habits]
 *     summary: Atualiza um hábito existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/habitId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HabitInput'
 *     responses:
 *       200:
 *         description: Hábito atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habit'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/:id', habitController.update);

/**
 * @openapi
 * /habits/{id}:
 *   delete:
 *     tags: [Habits]
 *     summary: Remove um hábito e todos os seus logs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/habitId'
 *     responses:
 *       204:
 *         description: Hábito removido com sucesso
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id', habitController.delete);

/**
 * @openapi
 * /habits/{id}/logs:
 *   get:
 *     tags: [HabitLogs]
 *     summary: Lista todos os logs de um hábito
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/habitId'
 *     responses:
 *       200:
 *         description: Lista de logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HabitLog'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id/logs', habitLogController.list);

/**
 * @openapi
 * /habits/{id}/logs:
 *   post:
 *     tags: [HabitLogs]
 *     summary: Registra uma execução do hábito em uma data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/habitId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HabitLogInput'
 *     responses:
 *       201:
 *         description: Log registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HabitLog'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
router.post('/:id/logs', habitLogController.create);

/**
 * @openapi
 * /habits/{id}/logs/{logId}:
 *   delete:
 *     tags: [HabitLogs]
 *     summary: Remove um log específico de um hábito
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/habitId'
 *       - name: logId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do log
 *     responses:
 *       204:
 *         description: Log removido com sucesso
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id/logs/:logId', habitLogController.delete);

export default router;
