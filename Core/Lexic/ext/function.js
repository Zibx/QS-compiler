/**
 * Created by zibx on 5/8/17.
 */
var wrapper = require('./Wrapper');

var UNKNOWN_ARGUMENT_TYPE = 'Variant',
    EMPTY_RETURN_VALUE = 'void';
var bodyParser = function(body) {
    var vars = {},
        parsed;
    try {
        parsed = VariableExtractor.parse(body.lines.join('\n'));
        body.ast = parsed.getAST();
        vars = parsed.getFullUnDefined();
    } catch (e) {
        throw e;
        body.pointer.error(e.description, {
            col: e.column,
            row: e.lineNumber - 1 + body.pointer.row
        });
    }
    body.vars = vars;
};
var tTools = require('../../tokenTools'),
    VariableExtractor = require('../../JS/VariableExtractor');

module.exports = wrapper(function (fn, data) {
    var matched = data.matched,
        item = data.item;

    // yep, it's function!
    var fnBody = fn.body;

    if (fnBody && fnBody.tokens && fnBody.tokens.length && fnBody.type === 'Brace' && fnBody.info === '{') {
        // braced function body
        var bodyTokens = fnBody.tokens;
        bodyTokens = bodyTokens.slice(1, bodyTokens.length - 1);
    } else {
        bodyTokens = fnBody;
    }
    bodyTokens = bodyTokens || [];

    if(item.children)
        bodyTokens = bodyTokens.concat(item.children);

    //console.log(fn.returnType);
    matched.value = {
        type: 'FUNCTION',
        arguments: fn.arguments.tokens.length < 3 ? [] : tTools.split(
                fn.arguments.tokens.slice(1,fn.arguments.tokens.length-1), {type: 'COMMA'}
            ).map(tTools.trim),
        body: tTools.toString(
            bodyTokens.length === 1 && bodyTokens[0].type==='Brace' && bodyTokens[0].info==='{' ?  bodyTokens[0].tokens.slice(1,bodyTokens[0].tokens.length-2) : bodyTokens)
    };

    /** TODO check for return in js ast. DIRTY HACK*/
    if(fn.returnType){
        matched.value.returnType = fn.returnType.data
    }else{
        matched.value.returnType = matched.value.body.data.indexOf('return')>-1 ?
            UNKNOWN_ARGUMENT_TYPE
            : EMPTY_RETURN_VALUE;
    }

    /** END OF DIRTY HACK */


    bodyParser(matched.value.body);

    matched.value['arguments'] = matched.value['arguments'].map(function(item){
        // argument info extraction

        var argType = item.length>1?
                tTools.trim(item.slice(0, item.length - 1))
                    .map(function(item){return item.data;})
                    .join('')
                :UNKNOWN_ARGUMENT_TYPE,
            name = item[item.length - 1].data;
        delete matched.value.body.vars[name];

        return {
            name: name,
            type: argType,
            pointer: item[0].pointer};
    });


    //console.log(matched.value.arguments[0]);

    return matched;
});