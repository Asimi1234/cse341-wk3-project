const express = require('express');
const router = express.Router();
const {
  getAllTitles,
  getTitleById,
  createTitle,
  updateTitle,
  deleteTitle,
} = require('../controllers/titlesController');

/**
 * @swagger
 * tags:
 *   name: Titles
 *   description: CRUD operations for movies and shows on the watchlist
 */

/**
 * @swagger
 * /titles:
 *   get:
 *     summary: Get all titles
 *     tags: [Titles]
 *     responses:
 *       200:
 *         description: A list of all titles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Title'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getAllTitles);

/**
 * @swagger
 * /titles/{id}:
 *   get:
 *     summary: Get a single title by id
 *     tags: [Titles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the title
 *     responses:
 *       200:
 *         description: The requested title
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Title'
 *       400:
 *         description: Invalid id format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Title not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getTitleById);

/**
 * @swagger
 * /titles:
 *   post:
 *     summary: Create a new title
 *     tags: [Titles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Title'
 *     responses:
 *       201:
 *         description: The created title
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Title'
 *       400:
 *         description: Validation error (missing/invalid fields)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', createTitle);

/**
 * @swagger
 * /titles/{id}:
 *   put:
 *     summary: Update an existing title
 *     tags: [Titles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the title
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Title'
 *     responses:
 *       200:
 *         description: The updated title
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Title'
 *       400:
 *         description: Validation error or invalid id format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Title not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', updateTitle);

/**
 * @swagger
 * /titles/{id}:
 *   delete:
 *     summary: Delete a title
 *     tags: [Titles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the title
 *     responses:
 *       200:
 *         description: Title deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Title deleted successfully
 *       400:
 *         description: Invalid id format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Title not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', deleteTitle);

module.exports = router;
