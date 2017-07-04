# JS Code standards

# Quality standards in Quokka team

This document serves as the complete definition of Quokka's coding standards for source code in JavaScript programming language.


## 1) Source file basics

### 1.1) File name

File names must be camel cased and may include underscores (_), but no additional punctuation. Filenames’ extension must be `.js`.


### 1.2) File encoding: UTF-8

Source files are encoded in UTF-8.


### 1.3) Whitespace characters

Aside from the line terminator sequence, the ASCII horizontal space character (0x21) is the only whitespace character that appears anywhere in a source file. This implies that

All other whitespace characters in string literals are escaped, and

Tab characters are not used for indentation.


### 1.4) Special escape sequences

For any character that has a special escape sequence (\', \", \\, \b, \f, \n, \r, \t, \v), that sequence is used rather than the corresponding numeric escape (e.g \x0a, \u000a, or \u{a}). Legacy octal escapes are never used.


### 1.5) Non-ASCII characters

For the remaining non-ASCII characters, either the actual Unicode character (e.g. ∞) or the equivalent hex or Unicode escape (e.g. \u221e) is used, depending only on which makes the code easier to read and understand.

Tip: In the Unicode escape case, and occasionally even when actual Unicode characters are used, an explanatory comment can be very helpful.

Tip: Never make your code less readable simply out of fear that some programs might not handle non-ASCII characters properly. If that happens, those programs are broken and they must be fixed.


### 1.6) Braces

Braces are used for all control structures

Braces follow the Kernighan and Ritchie style (Egyptian brackets) for nonempty blocks and block-like constructs:

- No line break before the opening brace.
- Line break after the opening brace.
- Line break before the closing brace.
- Line break after the closing brace if that brace terminates a statement or the body of a function or class statement, or a class method.
  Specifically, there is no line break after the brace if it is followed by else, catch, while, or a comma, semicolon, or right-parenthesis.


### 1.7) Indentation

Each time a new block or block-like construct is opened, the indent increases by two spaces. When the block ends, the indent returns to the previous indent level. The indent level applies to both code and comments throughout the block.


### 1.8) Semicolons are required

Every statement must be terminated with a semicolon. Relying on automatic semicolon insertion is forbidden.


### 1.9) Do not mix quoted and unquoted keys

Object literals may represent either structs (with unquoted keys and/or symbols) or dicts (with quoted and/or computed keys). Do not mix these key types in a single object literal.

Illegal:

```js
{
  a: 42, // struct-style unquoted key
  'b': 43, // dict-style quoted key
}
```

### 1.10) Use single quotes

Ordinary string literals are delimited with single quotes ('), rather than double quotes (").

Tip: use double quote only if the string contains lots of single quotes that would be more difficult to escape.

Ordinary string literals may not span multiple lines.


## 2) Source file content

### 2.1) Modern features

We do not use sugar. export, import, modern classes, let, const, setters, getters, weakMaps, generators and so on.
We know that they exist and how they work, but we have got reasons for all of them.
Good old js gives developer a tiny set of tools that do exactly the specific job that they were designed for.
If you know what you are doing - that tools are enough.


### 2.2) Syntax of native class

```js
var Quokka = function(cfg){
  Object.assign(this, cfg); //it is a good idea to make the instance extandable
};

Quokka.prototype = { // use object syntax if you can, you do not have to repeat Quokka.prototype.***** for each property
  jump: function(){},
  sleep: function(){},
  who: function(){
    console.log(this.name);
  }
};


// instantiate
var pet = new Quokka({name: 'Gorge'});
pet.who(); // says `Gorge`
```


### 2.3) Syntax of server side Quokka classes

```js
     module.exports = QRequire('Core.QObject', function(QObject){ // async dependency resolving
       'use strict';
       return QObject.extend('MyNamespace', 'Mammal', { // specify namespace and class name
           ctor: function( cfg ){ //
               ... // set instance properties here
           },
           breath: function(){
           }
       });
     });
```

```js
  module.exports = QRequire('MyNamespace.Mammal', function(Mammal){ // async dependency resolving
    'use strict';
    return Mammal.extend('MyNamespace', 'Cat', { // specify namespace and class name
        ctor: function( cfg ){ //
            ... // set instance properties here

            this.breath(); // inherited
        }
    });
  });
```


### 2.4) Garbage collection

Garbage collector is smart but it can not handle all cases.
You must help him in situations when it should collect children that are subscribed to parent's events (for example update layout or destroy events).

In classes extended from QObject we have ~destroy method which is called when parent wants to exterminate children.


### 2.5) Inheritance
Always divide your abstractions in two parts:
1) Unique instance data.
2) Not unique data that is required to all instances, and methods.

Put the second part to class prototype.

!Remember: if you store some data in instance code in property that came from prototype - it will.


### 2.6) Modifying builtin objects

Never modify builtin types, either by adding methods to their constructors or to their prototypes.
Avoid depending on libraries that do this.
Note that the JSCompiler’s runtime library will provide standards-compliant polyfills where possible;
nothing else may modify builtin objects.


### 2.7) Preferable constructions

Functional programming is a good part, but do not use it in cpu heavy code.
Simple for is still 5 times faster than map\filter\reduce.


### 2.8) Must Not

Developer must
 - do not allocate memory using ...Array.alloc
 - do not use constructors for Boolean, String, Array, Object. !!(new Boolean(false)) is true in js.
 - do not use double equal check `==`. Only triple `===` and `!==`.

## 3) DRY Principle

Do Not Repeat yourself is the only proper way of writing code.
If you wrote code twice - you are doing it wrong.
Copy-paste is wrong too. Extract repeating parts and make subroutine.


## 4) Testing

We are using mocha\assert for writing tests
Good code should be 100% covered by unit tests.
You can use istanbul for checking percent of coverage.
