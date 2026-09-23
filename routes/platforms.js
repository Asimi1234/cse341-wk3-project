const express = require('express');
const router = express.Router();
const {
  getAllPlatforms,
  getPlatformById,
  createPlatform,
  updatePlatform,
  deletePlatform,
} = require('../controllers/platformsController');

/**
 * @swagger
 * tags:
 *   name: Platforms
 *   description: Streaming platforms/services where titles can be watched
 */

/**
 * @swagger
 * /platforms:
 *   get:
 *     summary: Get all platforms
 *     tags: [Platforms]
 *     responses:
 *       200:
 *         description: A list of all platforms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Platform'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getAllPlatforms);

/**
 * @swagger
 * /platforms/{id}:
 *   get:
 *     summary: Get a single platform by id
 *     tags: [Platforms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the platform
 *     responses:
 *       200:
 *         description: The requested platform
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Platform'
 *       400:
 *         description: Invalid id format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Platform not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getPlatformById);

/**
 * @swagger
 * /platforms:
 *   post:
 *     summary: Create a new platform
 *     tags: [Platforms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Platform'
 *     responses:
 *       201:
 *         description: The created platform
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Platform'
 *       400:
 *         description: Validation error or duplicate platform name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', createPlatform);

/**
 * @swagger
 * /platforms/{id}:
 *   put:
 *     summary: Update an existing platform
 *     tags: [Platforms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the platform
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Platform'
 *     responses:
 *       200:
 *         description: The updated platform
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Platform'
 *       400:
 *         description: Validation error, duplicate name, or invalid id format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Platform not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', updatePlatform);

/**
 * @swagger
 * /platforms/{id}:
 *   delete:
 *     summary: Delete a platform
 *     tags: [Platforms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the platform
 *     responses:
 *       200:
 *         description: Platform deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Platform deleted successfully
 *       400:
 *         description: Invalid id format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Platform not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', deletePlatform);

module.exports = router;
