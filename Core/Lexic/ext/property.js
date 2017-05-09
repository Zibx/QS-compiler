/**
 * Created by zibx on 5/8/17.
 */
module.exports = (function () {
    return function (match, name) {
        return function (item) {
            var matched = match(name, item);
            if(!matched)
                return false;
            return matched;
        }
    }

})();