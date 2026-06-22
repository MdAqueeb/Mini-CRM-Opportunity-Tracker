import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    customerName: {
      type: String,
      required: true,
      trim: true
    },

    contactName: {
      type: String,
      default: null
    },

    contactEmail: {
      type: String,
      default: null
    },

    contactPhone: {
      type: String,
      default: null
    },

    requirement: {
      type: String,
      required: true,
      trim: true
    },

    estimatedValue: {
      type: Number,
      default: 0,
      min: 0
    },

    stage: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Qualified",
        "Proposal Sent",
        "Won",
        "Lost"
      ],
      default: "New"
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },

    nextFollowUpDate: {
      type: Date,
      default: null
    },

    notes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Opportunity = mongoose.model(
  "Opportunity",
  opportunitySchema
);

export default Opportunity;