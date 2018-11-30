import TronWeb from "tronweb";
import netRouter from "services/netRouter.js";
import Util from "utils/utils.js";
import _ from "lodash";

function AccountResource() {
  return {
    balance: 0,
    balanceEnergy: 0,
    energyLimit: 0,
    energyUsed: 0,
    totalEnergyLimit: 0,
    totalEnergyWeight: 0,
    remainEnergyLimit: 0,
    feeLimit: 0,
    feeLimitEnergy: 0,
    maxEnergyLimit: 0,
    freeBandWidthLimit: 0,
    freeBandWidthUsed: 0,
    bandWidthLimit: 0,
    bandWidthUsed: 0,
    totalBandWidthLimit: 0,
    totalBandWidthWeight: 0,
    maxBandWidthLimit: 0,
    ratio: 0
  };
}

function Witness() {
  return {
    address: "",
    name: "",
    url: "",
    votes: 0,
    votesdiff: 0,
    votesPersentage: 0,
    voteReward: 0,
    blockReward: 0,
    totalReward: 0
  };
}

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
    let energy = (
      (trx * resource.TotalEnergyLimit) /
      resource.TotalEnergyWeight
    ).toLocaleString();
    return { energy: energy, accountResource: resource };
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
    ar.balanceEnergy = this._filterData(account.balance) / 20;
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

    ar.maxEnergyLimit = ar.maxEnergyLimit.toLocaleString();

    ar.totalEnergyLimit = res.TotalEnergyLimit;
    ar.totalEnergyWeight = res.TotalEnergyWeight;
    ar.ratio = ratio.toFixed(4);

    return ar;
  }

  async getFrozenBandwidth(trx) {
    const resource = await this.getAccountResources();
    let bp = (
      (trx * resource.TotalNetLimit) /
      resource.TotalNetWeight
    ).toLocaleString();
    return { bp: bp, accountResource: resource };
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
    ar.maxBandWidthLimit = (
      ar.freeBandWidthLimit +
      ar.bandWidthLimit -
      ar.freeBandWidthUsed -
      ar.bandWidthUsed
    ).toLocaleString();

    ar.totalBandWidthLimit = res.TotalNetLimit;
    ar.totalBandWidthWeight = res.TotalNetWeight;
    ar.ratio = ratio.toFixed(4);

    return ar;
  }

  async getSuperRepresentatives() {
    const srs = await this._tronWeb.trx.listSuperRepresentatives();
    let data = [];
    let srData = [];
    let candidateData = [];
    let totalVotes = _.sumBy(srs, sr => {
      return sr.voteCount;
    });
    let totalVoteReward = 16 * 20 * 60 * 24;
    let totalBlockReward = 2 * totalVoteReward;
    await Promise.all(
      srs.map(async sr => {
        let witness = new Witness();
        const account = await this.getAccount(sr.address);
        if (account.account_name !== undefined) {
          witness.name = Util.byteToString(
            Util.hexstring2btye(account.account_name)
          );
        } else {
          witness.name = sr.url;
        }
        witness.address = sr.address;
        witness.votes = this._filterData(sr.voteCount);
        witness.votesPersentage = (100 * (witness.votes / totalVotes)).toFixed(
          2
        );
        witness.url = sr.url;
        witness.voteReward = Math.ceil(
          totalVoteReward * (witness.votes / totalVotes)
        );
        witness.blockReward = Math.ceil(totalBlockReward / 27);
        witness.totalReward = witness.voteReward + witness.blockReward;
        data.push(witness);
      })
    );
    data = _.sortBy(data, d => {
      return d.votes * -1;
    });

    data.map((sr, index) => {
      if (index < 27) {
        srData.push(sr);
      } else {
        candidateData.push(sr);
      }
      return 0;
    });
    return {
      srData: srData,
      candidateData: candidateData,
      allData: data,
      totalVotes: totalVotes
    };
  }

  async getAccount(address) {
    return this._tronWeb.trx.getAccount(address);
  }
}

export default new Calculator();
