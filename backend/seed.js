// ============================================================
// Demo seed script
// Creates two demo accounts and 20 opportunities (10 each) for a
// populated shared pipeline. Re-runnable: it removes the two demo
// users + their opportunities first, leaving any other data intact.
//
// Run:  node seed.js
// ============================================================

import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "./src/models/User.js";
import Opportunity from "./src/models/Opportunity.js";

dotenv.config();

const PASSWORD = "password123";

const DEMO_USERS = [
  { name: "Alice Carter", email: "alice@crm.com" },
  { name: "Ben Walker", email: "ben@crm.com" }
];

// 20 opportunity templates (owner is assigned below: 10 + 10).
const OPPORTUNITIES = [
  { customerName: "Acme Industries", contactName: "Rahul Mehta", contactEmail: "rahul@acme.com", contactPhone: "9810011001", requirement: "CRM rollout for 50-person sales team", estimatedValue: 450000, stage: "Qualified", priority: "High", nextFollowUpDate: "2026-07-02", notes: "Budget approved, awaiting procurement." },
  { customerName: "BlueWave Tech", contactName: "Sara Khan", contactEmail: "sara@bluewave.io", contactPhone: "9810011002", requirement: "Custom reporting dashboard", estimatedValue: 120000, stage: "Contacted", priority: "Medium", nextFollowUpDate: "2026-06-28", notes: "Demo scheduled next week." },
  { customerName: "Nimbus Logistics", contactName: "David Roy", contactEmail: "david@nimbus.com", contactPhone: "9810011003", requirement: "Fleet tracking integration", estimatedValue: 300000, stage: "Proposal Sent", priority: "High", nextFollowUpDate: "2026-07-05", notes: "Waiting on signed proposal." },
  { customerName: "GreenLeaf Foods", contactName: "Priya Nair", contactEmail: "priya@greenleaf.com", contactPhone: "9810011004", requirement: "Lead capture from website", estimatedValue: 60000, stage: "New", priority: "Low", nextFollowUpDate: "2026-07-10", notes: "Inbound enquiry." },
  { customerName: "Vertex Capital", contactName: "John Mathew", contactEmail: "john@vertex.com", contactPhone: "9810011005", requirement: "Investor pipeline tracking", estimatedValue: 750000, stage: "Won", priority: "High", nextFollowUpDate: null, notes: "Closed — onboarding started." },
  { customerName: "Orbit Media", contactName: "Neha Gupta", contactEmail: "neha@orbit.com", contactPhone: "9810011006", requirement: "Campaign lead management", estimatedValue: 95000, stage: "Contacted", priority: "Medium", nextFollowUpDate: "2026-06-30", notes: "Followed up via email." },
  { customerName: "Stellar Motors", contactName: "Imran Ali", contactEmail: "imran@stellar.com", contactPhone: "9810011007", requirement: "Dealer enquiry pipeline", estimatedValue: 210000, stage: "Qualified", priority: "High", nextFollowUpDate: "2026-07-01", notes: "Strong intent." },
  { customerName: "PixelForge", contactName: "Tina D", contactEmail: "tina@pixelforge.com", contactPhone: "9810011008", requirement: "Freelance project tracker", estimatedValue: 40000, stage: "Lost", priority: "Low", nextFollowUpDate: null, notes: "Went with a competitor." },
  { customerName: "Quantum Labs", contactName: "Arjun Singh", contactEmail: "arjun@quantum.com", contactPhone: "9810011009", requirement: "R&D grant pipeline", estimatedValue: 520000, stage: "Proposal Sent", priority: "Medium", nextFollowUpDate: "2026-07-08", notes: "Proposal under review." },
  { customerName: "Harbor Retail", contactName: "Meera Joshi", contactEmail: "meera@harbor.com", contactPhone: "9810011010", requirement: "Store lead consolidation", estimatedValue: 130000, stage: "New", priority: "Medium", nextFollowUpDate: "2026-07-12", notes: "Initial call done." },
  { customerName: "Apex Builders", contactName: "Sanjay Rao", contactEmail: "sanjay@apex.com", contactPhone: "9810011011", requirement: "Project bid tracking", estimatedValue: 680000, stage: "Qualified", priority: "High", nextFollowUpDate: "2026-07-03", notes: "Decision maker engaged." },
  { customerName: "Lumen Health", contactName: "Kavya R", contactEmail: "kavya@lumen.com", contactPhone: "9810011012", requirement: "Patient referral pipeline", estimatedValue: 240000, stage: "Contacted", priority: "Medium", nextFollowUpDate: "2026-06-29", notes: "Compliance questions raised." },
  { customerName: "Cobalt Finance", contactName: "Rohit Sen", contactEmail: "rohit@cobalt.com", contactPhone: "9810011013", requirement: "Loan lead management", estimatedValue: 410000, stage: "Proposal Sent", priority: "High", nextFollowUpDate: "2026-07-06", notes: "Negotiating terms." },
  { customerName: "Solaris Energy", contactName: "Anita Verma", contactEmail: "anita@solaris.com", contactPhone: "9810011014", requirement: "Solar enquiry tracking", estimatedValue: 175000, stage: "New", priority: "Low", nextFollowUpDate: "2026-07-15", notes: "Cold inbound." },
  { customerName: "Titan Sports", contactName: "Vikram B", contactEmail: "vikram@titan.com", contactPhone: "9810011015", requirement: "Sponsorship deal tracker", estimatedValue: 560000, stage: "Won", priority: "High", nextFollowUpDate: null, notes: "Deal signed last quarter." },
  { customerName: "Maple Edu", contactName: "Deepa M", contactEmail: "deepa@maple.com", contactPhone: "9810011016", requirement: "Admissions lead funnel", estimatedValue: 88000, stage: "Contacted", priority: "Medium", nextFollowUpDate: "2026-07-04", notes: "Trial offered." },
  { customerName: "Ironclad Security", contactName: "Faisal K", contactEmail: "faisal@ironclad.com", contactPhone: "9810011017", requirement: "Enterprise security upsell", estimatedValue: 920000, stage: "Qualified", priority: "High", nextFollowUpDate: "2026-07-07", notes: "Exec sponsor identified." },
  { customerName: "Breeze Travel", contactName: "Pooja S", contactEmail: "pooja@breeze.com", contactPhone: "9810011018", requirement: "Booking enquiry pipeline", estimatedValue: 70000, stage: "Lost", priority: "Low", nextFollowUpDate: null, notes: "No budget this year." },
  { customerName: "Forge Manufacturing", contactName: "Karan T", contactEmail: "karan@forge.com", contactPhone: "9810011019", requirement: "Distributor lead system", estimatedValue: 360000, stage: "New", priority: "Medium", nextFollowUpDate: "2026-07-11", notes: "Referred by partner." },
  { customerName: "Zenith Software", contactName: "Lisa W", contactEmail: "lisa@zenith.com", contactPhone: "9810011020", requirement: "SaaS renewal pipeline", estimatedValue: 280000, stage: "Proposal Sent", priority: "High", nextFollowUpDate: "2026-07-09", notes: "Renewal proposal sent." }
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const hashed = await bcrypt.hash(PASSWORD, 10);
  const owners = [];

  // Recreate the two demo users cleanly.
  for (const u of DEMO_USERS) {
    const existing = await User.findOne({ email: u.email });
    if (existing) {
      await Opportunity.deleteMany({ owner: existing._id });
      await User.deleteOne({ _id: existing._id });
    }
    const created = await User.create({ ...u, password: hashed });
    owners.push(created._id);
    console.log(`Created user: ${u.name} <${u.email}>`);
  }

  // Assign 10 opportunities to each owner.
  const docs = OPPORTUNITIES.map((o, i) => ({
    ...o,
    owner: i < 10 ? owners[0] : owners[1]
  }));
  await Opportunity.insertMany(docs);
  console.log(`Inserted ${docs.length} opportunities (10 per user)`);

  const total = await Opportunity.countDocuments();
  console.log(`Total opportunities in DB: ${total}`);
  console.log(`\nDemo login password for both accounts: ${PASSWORD}`);

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
