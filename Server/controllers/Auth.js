const User = require("../models/User");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const mailSender = require("../config/mailsender");
require("dotenv").config();

//send otp

//signup
exports.singUp = async (req, res) => {
  try {
    //fetch the data
    //validation of data
    //check password and confirm password
    //check user already exist or not
    //find the recent otp
    //hashed the password
    //create the entry in database
    //return response
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while Registering a user",
    });
  }
};

//login
exports.login = async (req, res) => {
  try {
    //fetch the email, contact, password number of the user
    //check user exist or not
    //generate token after validating the password
    if (await bcrypt.compare) {
      //create the payload
      //create the cookie and return the password
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while loging the user",
    });
  }
};

//changePassword handler(use this handler when user is logged in )
exports.changePassword = async (req, res) => {
  try {
    //fetch the user details
    //check whether user exist or not
    //check old password valid or not
    //check whether new password and confrm password macthing or not
    //if yes !!! then hashed the new password and update the password in the database
  } catch (error) {
    console.log(error)
    return res.status(500).json({
        success:false,
        message:"Something went wrong while changing the password"
    })
  }
};
