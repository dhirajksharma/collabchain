const express=require("express");
const router=express.Router();

router.route("/organizations")
    .get() //get list of all organizations
router.route("/domains")
    .get() //get list of all domains

module.exports=router;