const mongoose = require("mongoose");
const mailSender = require("../config/mailsender");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60 * 1000,
  },
});

const sendEmail = async (email, otp) => {
  try {
    const response = await mailSender(
      email,
      "Eamil from restaurant ordering system ",
      otp
    );
    console.log("Mail send successfully ", response);
  } catch (error) {
    console.log("Error occured while sending an email : ", error);
    throw error;
  }
};

otpSchema.pre("save", async (next) => {
  console.log("New document saved to database");

  //send mail only when the document is created
  if (this.isNew) {
    await sendEmail(this.email, this.otp);
  }
  next();
});

module.exports = mongoose.model("Otp", otpSchema);
