/**
 * Created by zibx on 5/8/17.
 */
module.exports = (function () {
    return function (cb) {
        return function (match, name) {
            name = Array.isArray(name) ? name : [name];
            return function (item) {
                var i, _i, matched;
                for (i = 0, _i = name.length; i < _i; i++) {
                    matched = match(name[i], item);
                    if (matched)
                        break;
                }
                if (!matched)
                    return false;
                return cb(matched, item);
            };
        };
    };
})();