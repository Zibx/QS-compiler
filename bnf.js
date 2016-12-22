/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2016
// By zibx on 12/22/16.

module.exports = (function () {
    'use strict';
    return {
        start: [
            ["input EOF", "return $$;"]
        ],
        input: [
            ["",           "$$ = [];"],
            ["line input", "$$ = [$1].concat($2);"]
        ],
        line: [
            ["exp SEMICOLON", "$$ = $1;"]
        ],
        exp: [
            ["NUMBER",           "$$ = new yy.Number(@1.first_line, @1.first_column, yytext);"],
            ["VARIABLE",         "$$ = new yy.Variable(@1.first_line, @1.first_column, yytext);"],
            ["exp exp operator", "$$ = new yy.Expression(@3.first_line, @3.first_column, $1, $2, $3);"]
        ],
        operator: [
            ["PRINT", "$$ = new yy.Operator(@1.first_line, @1.first_column, yytext);"],
            ["=",     "$$ = new yy.Operator(@1.first_line, @1.first_column, yytext);"],
            ["+",     "$$ = new yy.Operator(@1.first_line, @1.first_column, yytext);"],
            ["-",     "$$ = new yy.Operator(@1.first_line, @1.first_column, yytext);"],
            ["*",     "$$ = new yy.Operator(@1.first_line, @1.first_column, yytext);"],
            ["/",     "$$ = new yy.Operator(@1.first_line, @1.first_column, yytext);"]
        ]
    };
})();