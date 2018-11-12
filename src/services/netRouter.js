import { nets } from "config/netConfig.js";

const defaultNet = "MainNet";
const storageKey = "TronStation_Node";

const netRouter = {
  initNode() {
    this._currNet = defaultNet;
    let storageNet = this.getLocalStorage(storageKey);
    if (storageNet) {
      this._currNet = storageNet;
    } else {
      this.setNet(this._currNet);
    }
  },
  getLocalStorage(key) {
    const net = window.localStorage.getItem(key);
    if (net) return net;
  },
  setLocalStorage(key, data) {
    window.localStorage.setItem(key, data);
  },
  getNet() {
    let net = this.getLocalStorage(storageKey);
    if (net) {
      return nets[net];
    }
    this.setNet(this.defaultNet);
    return nets[this.defaultNet];
  },
  setNet(net) {
    this._node = net;
    this.setLocalStorage(storageKey, net);
  }
};

netRouter.initNode();

export default netRouter;
