const Category = require("../models/Category");

exports.createCategory = async(req,res) => {
    try {
        const {name , description} = req.body
        if(!name || !description){
            return res.status(403).json({
                success:false,
                message:"Please provide all fields",
            })
        }

        const response = await Category.create({
            name:name,
            description:description,
        })
        return res.status(200).json({
            success:true,
            message:"Category created",
            response:response,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something went wrong while creating the category",
            error:error,
        })
    }
}

exports.deleteCategory = async(req,res) => {
    try {
        
    } catch (error) {
        
    }
}

exports.fetchItemWithSpecificCategory = async(req,res) => {
    try {
        
    } catch (error) {
        
    }
}