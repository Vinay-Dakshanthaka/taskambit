const express = require('express')
// const jwt = require('jsonwebtoken')
const db = require('../models')
const fs = require('fs')
// const {baseURL } = require('../config/baseUrlConfig')

const User = db.User;

const getAnyProfileImage = async (req, res) =>{
    try {
        const {user_id} = req.body; 
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

const getAllUserDetails = async (req, res) => {
    try {
        const { user_id } = req.user;

        const requestingUser = await User.findOne({ where: { user_id } });

        if (!requestingUser) {
            return res.status(400).send("No User Found");
        }

        const userRole = requestingUser.role;
        if (userRole !== 'SUPER ADMIN') {
            return res.status(403).send({ message: "Access Forbidden" });
        }

        const users = await User.findAll({
            attributes: ['user_id', 'name', 'email', 'phoneNumber', 'role', 'imagePath']
        });

        if (!users || users.length === 0) {
            return res.status(404).send({ message: "No Users Found" });
        }

        return res.status(200).send({ users });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Error while fetching user details" });
    }
}

module.exports = {
    getAnyProfileImage,
    getAllUserDetails,
}
