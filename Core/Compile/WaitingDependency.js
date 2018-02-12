/**
 * Created by zin on 30/11/2017.
 */
var WaitingDependency = function(what, item) {
    this.what = what;
    this.item = item;
};
WaitingDependency.prototype = {
    toString: function() {
        return this.what;
    }
};
module.exports = WaitingDependency;