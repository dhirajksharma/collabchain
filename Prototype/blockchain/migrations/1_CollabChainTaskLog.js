var primaryContract=artifacts.require("./CollabChainTaskLog.sol");

module.exports=function(deployer){
    deployer.deploy(primaryContract);
}