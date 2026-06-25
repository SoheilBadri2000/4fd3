import mongoose from "mongoose";

const symptomCheckSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  symptoms: { type: String, required: true },
  response: {
    urgency: String,
    possibleExplanations: [String],
    warningSignsToWatch: [String],
    suggestedNextSteps: [String],
  },
}, { timestamps: true });

export default mongoose.model("SymptomCheck", symptomCheckSchema);
