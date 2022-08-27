const fs = require('fs');
const path = require('path');

require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-truffle5");
require('@openzeppelin/test-helpers');


for (const f of fs.readdirSync(path.join(__dirname, 'hardhat'))) {
  require(path.join(__dirname, 'hardhat', f));
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
};
