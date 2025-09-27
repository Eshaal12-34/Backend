const express = require("express");
const router = express.Router();
const Contacts = require("../models/Contacts");

router.post("/",async (req,res) => {
  const {name, email, message} = req.body
  try{
    const newContact = new Contacts({name,email,message});
    await newContact.save();
    res.status(201).json({success : true, message:"Message sent successfully"})
  }catch(err){
    res.status(500).json({success : false, message:"server error"})
  }
})

module.exports = router;