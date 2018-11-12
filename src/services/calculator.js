import TronWeb from "tronweb";
import netRouter from "services/netRouter.js";

var AccountResource = function() {
  this.balance = 0;
  this.balanceEnergy = 0;
  this.energyLimit = 0;
  this.energyUsed = 0;
  this.totalEnergyLimit = 0;
  this.totalEnergyWeight = 0;
  this.remainEnergyLimit = 0;
  this.feeLimit = 0;
  this.feeLimitEnergy = 0;
  this.maxEnergyLimit = 0;
  this.freeBandWidthLimit = 0;
  this.freeBandWidthUsed = 0;
  this.bandWidthLimit = 0;
  this.bandWidthUsed = 0;
  this.totalBandWidthLimit = 0;
  this.totalBandWidthWeight = 0;
  this.maxBandWidthLimit = 0;
  this.ratio = 0;
};

class Calculator {
  constructor() {
    this._net = netRouter.getNet();
    this._tronWeb = new TronWeb(
      this._net.fullNode,
      this._net.solidityNode,
      this._net.eventServer
    );
    this._tronWeb.setDefaultBlock("latest");
  }

  setUpTronWeb() {
    this._net = netRouter.getNet();
    this._tronWeb.setFullNode(this._net.fullNode);
    this._tronWeb.setSolidityNode(this._net.solidityNode);
    this._tronWeb.setEventServer(this._net.eventServer);
    this._tronWeb.setDefaultBlock("latest");
  }

  _filterData(val) {
    return val === undefined ? 0 : val;
  }

  async getLastUpdateBlock(address) {
    if (!address) {
      address = this._net.defaultAddress;
    }
    const block = await this._tronWeb.trx.getCurrentBlock();
    return block.block_header.raw_data.number;
  }

  async getAccountResources(address) {
    if (!address) {
      address = this._net.defaultAddress;
    }
    return await this._tronWeb.trx.getAccountResources(address);
  }

  async getFrozenEnergy(trx) {
    const resource = await this.getAccountResources();
    return (
      (trx * resource.TotalEnergyLimit) /
      resource.TotalEnergyWeight
    ).toFixed(4);
  }

  async getMaxEnergyLimit(address, feeLimit) {
    let ar = new AccountResource();
    const account = await this._tronWeb.trx.getAccount(address);
    if (account.balance === undefined) {
      account.balance = 0;
    }
    const res = await this.getAccountResources(address);
    const ratio = res.TotalEnergyLimit / res.TotalEnergyWeight;

    // remaining energy limit
    ar.balance = this._filterData(account.balance) / 1000000; // trx
    ar.balanceEnergy = this._filterData(account.balance) / 100;
    ar.energyLimit = this._filterData(res.EnergyLimit); // trx
    ar.energyUsed = this._filterData(res.EnergyUsed);
    ar.remainEnergyLimit = ar.energyLimit + ar.balanceEnergy - ar.energyUsed;

    // feelimit energy
    ar.feeLimit = feeLimit;
    ar.feeLimitEnergy = (feeLimit * ratio).toFixed(4);

    // max energy limit
    if (ar.energyLimit > ar.feeLimitEnergy) {
      ar.maxEnergyLimit = Math.min(ar.remainEnergyLimit, ar.feeLimitEnergy);
    } else {
      ar.maxEnergyLimit = ar.remainEnergyLimit;
    }

    ar.totalEnergyLimit = res.TotalEnergyLimit;
    ar.totalEnergyWeight = res.TotalEnergyWeight;
    ar.ratio = ratio.toFixed(4);

    return ar;
  }

  async getFrozenBandwidth(trx) {
    const resource = await this.getAccountResources();
    return ((trx * resource.TotalNetLimit) / resource.TotalNetWeight).toFixed(
      4
    );
  }

  async getMaxBandWidthLimit(address) {
    let ar = new AccountResource();
    const account = await this._tronWeb.trx.getAccount(address);
    if (account.balance === undefined) {
      account.balance = 0;
    }
    const res = await this._tronWeb.trx.getAccountResources(address);
    const ratio = res.TotalNetLimit / res.TotalNetWeight;

    // remaining bp limit
    ar.balance = this._filterData(account.balance) / 1000000; // trx
    ar.freeBandWidthLimit = this._filterData(res.freeNetLimit);
    ar.freeBandWidthUsed = this._filterData(res.freeNetUsed);
    ar.bandWidthLimit = this._filterData(res.NetLimit);
    ar.bandWidthUsed = this._filterData(res.NetUsed);
    ar.maxBandWidthLimit =
      ar.freeBandWidthLimit +
      ar.bandWidthLimit -
      ar.freeBandWidthUsed -
      ar.bandWidthUsed;

    ar.totalBandWidthLimit = res.TotalNetLimit;
    ar.totalBandWidthWeight = res.TotalNetWeight;
    ar.ratio = ratio.toFixed(4);

    return ar;
  }
}

export default new Calculator();
