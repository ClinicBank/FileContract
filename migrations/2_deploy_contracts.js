const ClinicBankFile = artifacts.require("ClinicBankFile");

module.exports = async (deployer) => {
    deployer.deploy(ClinicBankFile)
};
