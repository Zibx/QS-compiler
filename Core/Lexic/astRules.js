/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2017
// By zibx on 1/27/17.

module.exports = (function () {
    'use strict';
    return  {
        DEFINE: [
            {type: 'WORD', data: ['def', 'define', 'class']},
            {type: 'WORD', put: '*extend'},
            {type: '*', count: 'any', items: [
                {type: 'COMMA', data: ','},
                {type: 'WORD', put: '*extend'}
            ]},
            {type: 'WORD', put: 'name'}
        ],
        'DEFINE#': [
            {type: 'WORD', data: ['def', 'define', 'class']},
            {type: 'WORD', put: 'name'},
            {type: 'SEMICOLON', data: ':'},
            {type: 'WORD', put: '*extend'},
            {type: '*', items: [
                {type: 'COMMA', data: ','},
                {type: 'WORD', put: '*extend'}
            ]}
        ],
        'PROPERTY': [
            {type: '?', items: [
                {type: 'WORD', data: {
                    'pub': 'public',
                    'public': 'public',
                    'private': 'private'
                }, put: 'scope'}
            ]},
            {type: 'WORD', put: 'class'},

            {type: '*', count: 'any', items: [
                {type: 'DOT', put: '*cls'},
                {type: '*', count: 'any', items: [
                    {type: '?', items:[
                        {type: 'WORD', put: '*cls'}
                    ]},
                    {type: '?', items:[
                        {type: 'PIPE', put: '*cls'}
                    ]}
                ]}
            ] },
            {type: '?', items: [ {type: 'WORD', put: 'name'} ] },
            {type: '?', items: [
                {type: 'SEMICOLON', data: ':', put: 'semiToken'},
                {type: '?', items: [{type: 'ALL', put: 'value'}]}
            ]}
        ],
        'EVENT': [
            //{type: '*', items: [
            {type: 'DOT'},
            {type: 'WORD', put: 'name'},
            {type: '?', items: [
                {type: 'SEMICOLON', data: ':'},
                {type: 'ALL', put: 'value'}
            ]}
        ],
        'METADATA': [
            {type: 'DOG'},
            {type: 'WORD', put: 'name'},
            {type: '?', items: [
                {type: 'SEMICOLON', data: ':'},
                {type: 'ALL', put: 'value'}
            ]}
        ],
        'FUNCTION': [
            {type: '?', items: [
                {type: 'WORD', put: 'returnType', 'notData': ['function', 'fn', 'fun', 'func']}
            ]},
            {type: '?', items: [
                {type: 'WORD', data: ['function', 'fn', 'fun', 'func']}
            ]},
            {type: 'Brace', info: '(', put: 'arguments'},
            {type: 'OR', items: [
                [
                    {type: 'OR', items: [
                        {type: 'OPERATION', data: '-'},
                        {type: 'COMPARE', data: '='}
                    ]},
                    {type: 'COMPARE', data: '>'},
                    {type: '?', items: [
                        {type: 'ALL', put: 'body'}
                    ]}
                ],
                [
                    {type: '?', items: [
                        {type: 'OR', items: [
                            {type: 'OPERATION', data: '-'},
                            {type: 'COMPARE', data: '='}
                        ]},
                        {type: 'COMPARE', data: '>'}
                    ]},
                    {type: 'Brace', info: '{', put: 'body'}
                ]
            ]}
        ]

    };
})();