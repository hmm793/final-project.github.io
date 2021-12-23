const mongoose = require("mongoose");

const teacherSchema = mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  gender: {
    type: String,
    enum: ["Male", "Female", "Others"],
    required: true,
  },
  date_of_birth: { type: Date, required: true },
  blood_group: {
    type: String,
    enum: ["A-", "B+", "B-", "O+", "O-"],
    required: true,
  },
  religion: {
    type: String,
    enum: ["Islam", "Hindu", "Christian", "Buddish", "Others"],
    required: true,
  },
  addmission_date: { type: Date },
  email: { type: String, unique: true },
  address: { type: String },
  phone: { type: String },
  password: { type: String },
  short_bio: { type: String },
  image: { type: String, default: "" },

  role: {
    type: String,
    enum: ["student", "headmaster", "teacher", "parent"],
    required: true,
  },
});

teacherSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
teacherSchema.set("toJSON", {
  virtuals: true,
});
const TeacherModel = mongoose.model("Teacher", teacherSchema);
module.exports = TeacherModel;
