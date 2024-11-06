const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Namaste", (m) => {
    const secureShare  = m.contract("SecureShare", []);
  
    m.call(secureShare, "getUploadedCIDs", ["0xf9C648a0292f9D09fEd5566738c6b74985f7C8F9"]);
  
    return { secureShare };
  });

