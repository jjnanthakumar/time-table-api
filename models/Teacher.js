import mongoose from "mongoose";
import "mongoose-type-email";
import Email from "mongoose-type-email";

let schema = new mongoose.Schema(
  {
    email: {
      type: Email,
      unique: true,
      lowercase: true,
      required: true,
    },
    type: {
      type: String,
      enum: ["recruiter", "applicant"],
      required: true,
    },
  },
  { collation: { locale: "en" } }
);

export default mongoose.model("Teacher", schema);
