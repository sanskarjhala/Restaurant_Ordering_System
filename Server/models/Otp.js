const mongoose = require("mongoose");
const mailSender = require("../config/mailsender");
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhoneNumber = process.env.TWILIO_PHONE_NO
const client = new twilio(accountSid , authToken); 

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  phone:{
    type:String,
    required:true,
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

  client.messages.create({
    body: `Your OTP code is ${otp}`,
    from: twilioPhoneNumber,
    to: phone
  })
  .then(message => console.log(`SMS sent: ${message.sid}`))
  .catch(error => console.error('Error sending SMS:', error));


  next();
});

module.exports = mongoose.model("Otp", otpSchema);
