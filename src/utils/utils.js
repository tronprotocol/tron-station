const Util = {
  verifyLength: function(v, minLen, maxLen) {
    if (v < minLen || v > maxLen) {
      return false;
    }
    return true;
  },
  isEmpty: function(v) {
    return v == null || v == undefined || v == "";
  }
};

export default Util;
