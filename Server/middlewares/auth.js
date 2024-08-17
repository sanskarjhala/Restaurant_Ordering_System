const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
  try {
    //extract token
    const token =
      (await req.cookies.token) ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");

    if(!token){
        return res.status(404).json({
            success:false,
            message:"Token not found"
        })
    }

    //verify the token
    try {
        const decode = jwt.verify(token , process.env.JWT_SECRET);
        console.log('Decode of token : ' , decode)
        req.user= decode;

    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Token is invalid"
        })
    }

    next();

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

//isAdmin
exports.isAdmin = async(req,res) =>{
    try {
        if(req.user.accountType !== 'Admin'){
            return res.status(403).json({
                success:false,
                message:"Protected route for admin"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something went wrong while authorisation"
        })
    }
}
//isManager
exports.isManager = async(req,res) =>{
    try {
        if(req.user.accountType !== 'Manager'){
            return res.status(403).json({
                success:false,
                message:"Protected route for Manager"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something went wrong while authorisation"
        })
    }
}
//isWaiter
exports.isWaiter = async(req,res) =>{
    try {
        if(req.user.accountType !== 'Waiter'){
            return res.status(403).json({
                success:false,
                message:"Protected route for Waiter"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something went wrong while authorisation"
        })
    }
}
//isCook
exports.isCook= async(req,res) =>{
    try {
        if(req.user.accountType !== 'Cook'){
            return res.status(403).json({
                success:false,
                message:"Protected route for Cook"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something went wrong while authorisation"
        })
    }
}
