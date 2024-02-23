const express=require("express");
const router=express.Router();
const {getAllOrg}=require("../controllers/organizationController");

router.route("/")
    .get(getAllOrg) //get list of all organizations

module.exports=router;