import express from "express";
import {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity
} from "../controllers/opportunityController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Opportunities
 *   description: CRM Opportunity Management APIs (Protected)
 */

// ========================
// GLOBAL PROTECTION
// ========================
router.use(protect);

/**
 * @swagger
 * /opportunities:
 *   get:
 *     tags: [Opportunities]
 *     summary: Get all opportunities
 *     description: Returns all opportunities in shared pipeline (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched opportunities (can be empty array)
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Server error
 */
router.get("/", getOpportunities);

/**
 * @swagger
 * /opportunities:
 *   post:
 *     tags: [Opportunities]
 *     summary: Create a new opportunity
 *     description: Creates opportunity with owner derived from JWT
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - requirement
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: ABC Corp
 *               contactName:
 *                 type: string
 *                 example: John Doe
 *               contactEmail:
 *                 type: string
 *                 example: john@abc.com
 *               contactPhone:
 *                 type: string
 *                 example: "9999999999"
 *               requirement:
 *                 type: string
 *                 example: CRM system required
 *               estimatedValue:
 *                 type: number
 *                 example: 50000
 *               stage:
 *                 type: string
 *                 example: New
 *               priority:
 *                 type: string
 *                 example: High
 *               nextFollowUpDate:
 *                 type: string
 *                 example: 2026-06-25
 *               notes:
 *                 type: string
 *                 example: First meeting done
 *     responses:
 *       201:
 *         description: Opportunity created successfully
 *       400:
 *         description: Validation error (missing required fields)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", createOpportunity);

/**
 * @swagger
 * /opportunities/{id}:
 *   get:
 *     tags: [Opportunities]
 *     summary: Get opportunity by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Opportunity found
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Opportunity not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getOpportunityById);

/**
 * @swagger
 * /opportunities/{id}:
 *   put:
 *     tags: [Opportunities]
 *     summary: Update opportunity (owner only)
 *     description: Only the creator of opportunity can update it
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               stage: Qualified
 *               priority: Medium
 *               notes: Updated after call
 *     responses:
 *       200:
 *         description: Opportunity updated successfully
 *       400:
 *         description: Invalid ID or request body
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not owner of opportunity
 *       404:
 *         description: Opportunity not found
 *       500:
 *         description: Server error
 */
router.put("/:id", updateOpportunity);

/**
 * @swagger
 * /opportunities/{id}:
 *   delete:
 *     tags: [Opportunities]
 *     summary: Delete opportunity (owner only)
 *     description: Only the creator of opportunity can delete it
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Opportunity deleted successfully
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not owner
 *       404:
 *         description: Opportunity not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteOpportunity);

export default router;