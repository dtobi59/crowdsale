
const { BN, ether, expectRevert } = require('@openzeppelin/test-helpers');

const WhitelistCrowdsale = artifacts.require('WhitelistCrowdsaleImpl');
const SimpleToken = artifacts.require('SimpleToken');

contract('WhitelistCrowdsale', function (accounts) {

  const [ wallet, whitelister, whitelisted, otherWhitelisted, other ] = accounts;

  const rate = new BN(1);
  const value = ether('42');
  const tokenSupply = new BN('10').pow(new BN('22'));
  const ROLE = "ff"; //web3.utils.soliditySha3('INVESTOR_WHITELISTED');

  beforeEach(async function () {
    this.token = await SimpleToken.new({ from: whitelister });
    this.crowdsale = await WhitelistCrowdsale.new(rate, wallet, this.token.address, { from: whitelister });
    await this.token.transfer(this.crowdsale.address, tokenSupply, { from: whitelister });
  });

  async function purchaseShouldSucceed (crowdsale, beneficiary, value) {
    await crowdsale.buyTokens(beneficiary, { from: beneficiary, value });
    await crowdsale.sendTransaction({ from: beneficiary, value });
  }

  async function purchaseExpectRevert (crowdsale, beneficiary, value) {
    await expectRevert(crowdsale.buyTokens(beneficiary, { from: beneficiary, value }),
      'WhitelistCrowdsale: beneficiary doesn\'t have the Whitelisted role'
    );
    await expectRevert(crowdsale.sendTransaction({ from: beneficiary, value }),
      'WhitelistCrowdsale: beneficiary doesn\'t have the Whitelisted role'
    );
  }

  context('with no whitelisted addresses', function () {
    it('rejects all purchases', async function () {
      await purchaseExpectRevert(this.crowdsale, other, value);
      await purchaseExpectRevert(this.crowdsale, whitelisted, value);
    });
  });

  context('with whitelisted addresses', function () {
    console.log("*****************************8");
    console.log(ROLE);
    beforeEach(async function () {
        // grantRole(ROLE, authorized, { from: other })
      
      await this.crowdsale.grantRole(ROLE, whitelisted, { from: whitelister });
      await this.crowdsale.grantRole(ROLE,otherWhitelisted, { from: whitelister });
    });

    it('accepts purchases with whitelisted beneficiaries', async function () {
      await purchaseShouldSucceed(this.crowdsale, whitelisted, value);
      await purchaseShouldSucceed(this.crowdsale, otherWhitelisted, value);
    });

    it('rejects purchases from whitelisted addresses with non-whitelisted beneficiaries', async function () {
      await expectRevert.unspecified(this.crowdsale.buyTokens(other, { from: whitelisted, value }));
    });

    it('rejects purchases with non-whitelisted beneficiaries', async function () {
      await purchaseExpectRevert(this.crowdsale, other, value);
    });
  });
});
