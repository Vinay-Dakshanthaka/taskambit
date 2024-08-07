const express = require('express')
const jwt = require('jsonwebtoken')
const db = require('../models')
const fs = require('fs')
const {baseURL } = require('../config/baseUrlConfig')
const { where } = require('sequelize')

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

module.exports = {
    saveProfileImage,
    getProfileImage,
}