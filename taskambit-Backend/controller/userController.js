// const express = require('express')
// const jwt = require('jsonwebtoken')
const db = require('../models')
const fs = require('fs')
// const {baseURL } = require('../config/baseUrlConfig')
// const { where } = require('sequelize')

const User = db.User;

const validFileFormats = ['jpeg', 'jpg', 'png'];

const saveProfileImage = async (req, res) => {
    try {
        const user_id = req.user_id;
        if(!req.file){
            return res.status(400).send({message : "No image uploaded."})
        }

        const fileFormats = req.file.originalname.split('.').pop().toLowerCase();
        if(!validFileFormats.includes(fileFormats)){
            return res.status(400).send({message : "Invalid file formate : Supported file formats : JPEG, JPG, PNG"})
        }

        const filePath = req.file.path; 

         await User.update({imagePath : filePath}, {where : {user_id}})

        return res.status(200).send({message : "Profile Picture updated successfully"})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message : "Failed to update profile image"})
    }
}

const getProfileImage = async (req, res) =>{
    try {
        const user_id = req.user_id; 
        const user = await User.findOne( {where : {user_id}})

        if(!user){
            return res.status(400).send("No User Found")
        }

        const imagePath = user.imagePath; 

        if(!imagePath){
            return res.status(404).send({message : "No Profile image found ", imagePath : null})
        }

        fs.readFile(imagePath, (err, data) => {
            if(err){
                console.log(err);
                return res.status(500).send({message : "Failed to fetch image "})
            }
            res.setHeader('conent-Type', 'image/jpeg');

            return res.status(200).send({data})
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).send({message : "Error while fetching image"});
    }
}

const getUserById = async (req, res) => {
    try {
        const { user_id } = req.user_id;

        const user = await User.findOne({ where: { user_id } });

        if (!user) {
            return res.status(400).send("No User Found");
        }

        // Extracting required user details
        const { name, email, phoneNumber } = user;

        return res.status(200).send({ name, email, phoneNumber });
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Error while fetching user details" });
    }
}

const updateUserDetailsById = async (req, res) => {
    try {
        const { user_id } = req.user_id; // Assuming user_id is extracted from req.user_id
        const { name, phoneNumber } = req.body; // Assuming new name and phoneNumber are sent in the request body

        // Fetch the user by user_id
        const user = await User.findOne({ where: { user_id } });

        if (!user) {
            return res.status(400).send("No User Found");
        }

        // Update the user's details
        user.name = name || user.name; // Only update if new value is provided
        user.phoneNumber = phoneNumber || user.phoneNumber;

        // Save the updated user
        await user.save();

        return res.status(200).send({ message: "User details updated successfully", user: { name: user.name, phoneNumber: user.phoneNumber } });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Error while updating user details" });
    }
}


module.exports = {
    saveProfileImage,
    getProfileImage,
    getUserById,
    updateUserDetailsById,
}