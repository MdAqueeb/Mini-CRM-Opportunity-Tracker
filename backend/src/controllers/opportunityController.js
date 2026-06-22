import mongoose from "mongoose";
import Opportunity from "../models/Opportunity.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// -------------------------
// CREATE OPPORTUNITY
// -------------------------
export const createOpportunity = async (req, res) => {
  try {
    const {
      customerName,
      contactName,
      contactEmail,
      contactPhone,
      requirement,
      estimatedValue,
      stage,
      priority,
      nextFollowUpDate,
      notes
    } = req.body;

    // 400 - validation error
    if (!customerName || !requirement) {
      return res.status(400).json({
        success: false,
        message: "customerName and requirement are required"
      });
    }

    const opportunity = await Opportunity.create({
      customerName,
      contactName,
      contactEmail,
      contactPhone,
      requirement,
      estimatedValue,
      stage,
      priority,
      nextFollowUpDate,
      notes,

      // derived from JWT (NOT frontend)
      owner: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: "Opportunity created successfully",
      data: opportunity
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// -------------------------
// GET ALL OPPORTUNITIES
// -------------------------
export const getOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find()
      .populate("owner", "name email");

    return res.status(200).json({
      success: true,
      count: opportunities.length,
      data: opportunities
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// -------------------------
// GET SINGLE OPPORTUNITY
// -------------------------
export const getOpportunityById = async (req, res) => {
  try {
    const { id } = req.params;

    // 400 - invalid ID
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid opportunity ID format"
      });
    }

    const opportunity = await Opportunity.findById(id)
      .populate("owner", "name email");

    // 404 - not found
    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: opportunity
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// -------------------------
// UPDATE OPPORTUNITY (OWNER ONLY)
// -------------------------
export const updateOpportunity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid opportunity ID format"
      });
    }

    const opportunity = await Opportunity.findById(id);

    // 404
    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found"
      });
    }

    // 403 - ownership check
    if (opportunity.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this opportunity"
      });
    }

    // 🔥 SAFE UPDATE (NO OWNER OVERRIDE)
    const allowedUpdates = {
      stage: req.body.stage,
      priority: req.body.priority,
      nextFollowUpDate: req.body.nextFollowUpDate,
      estimatedValue: req.body.estimatedValue,
      notes: req.body.notes
    };

    const updated = await Opportunity.findByIdAndUpdate(
      id,
      allowedUpdates,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Opportunity updated successfully",
      data: updated
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// -------------------------
// DELETE OPPORTUNITY (OWNER ONLY)
// -------------------------
export const deleteOpportunity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid opportunity ID format"
      });
    }

    const opportunity = await Opportunity.findById(id);

    // 404
    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found"
      });
    }

    // 403 ownership
    if (opportunity.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this opportunity"
      });
    }

    await Opportunity.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Opportunity deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};