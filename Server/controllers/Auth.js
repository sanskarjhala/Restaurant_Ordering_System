const User = require("../models/User");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const mailSender = require("../config/mailsender");
require("dotenv").config();
const Otp = require("../models/Otp");

//send otp
exports.sendOtp = async (req, res) => {
  try {
    const { email, phone } = req.body;

    let existingUser;
    if (email) {
      existingUser = await User.findOne({ email });
    } else if (phone) {
      existingUser = await User.findOne({ phone });
    } else {
      return res.status(401).json({
        success: false,
        message: "Nither the feel is provided ",
      });
    }

    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "User already exist",
      });
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    //ensure unique otp
    let result = await Otp.findOne({ otp });
    while (result) {
      let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await Otp.findOne({ otp });
    }

    const otpPayload = { email, phone, otp };
    await Otp.create(otpPayload);

    return res.status(200).json({
      success: true,
      message: "Otp send successfully",
      otp,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending the otp",
      error: error,
    });
  }
};

//signup
exports.singUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      password,
      confirmPassword,
      gender,
      accountType,
      otp,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !password ||
      !confirmPassword ||
      !gender ||
      !accountType ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "all fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(403).json({
        success: false,
        message: "Password and confirmPassword does not match",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(403).json({
        success: false,
        message: "User already exist",
      });
    }

    //find the recent otp
    const response = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1);
    console.log(response);
    if (response.length === 0) {
      // OTP not found for the email
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    } else if (otp !== response[0].otp) {
      // Invalid OTP
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      accountType: accountType,
    });

    return res.status(200).json({
      success: false,
      message: "User registered successfully",
      user: user,
    });
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
    const { email, phone, password } = req.body;

    let existingUser;
    if (email) {
      existingUser = await User.findOne({ email });
    } else if (contactNumber) {
      existingUser = await User.findOne({ phone });
    } else {
      return res.status(401).json({
        success: false,
        message: "Please provide all fields",
      });
    }

    if (existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //generate token after validating the password
    if (await bcrypt.compare(password, existingUser.password)) {
      //create the payload
      const payload = {
        email: existingUser.email,
        id: existingUser._id,
        accountType: existingUser.accountType,
      };
      //create the cookie and return the password
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "48h",
      });

      existingUser.token = token;
      existingUser.password = undefined;

      return res
        .cookie("token", token, {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        })
        .status(200)
        .json({
          success: true,
          token,
          user,
          message: "user logged in successfully",
        });
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
    const userDetails = await User.findById(req.user.id);
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordMatched = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );

    if (!isPasswordMatched) {
      return res.status(403).json({
        success: false,
        message: "Password not matched",
      });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "password updated successfully",
      updatedUserDetails: updatedUserDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while changing the password",
    });
  }
};
