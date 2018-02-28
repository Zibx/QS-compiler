# Primitive Data Types in QuokkaScript
QuokkaScript is a *strongly typed* language and has five types, five of them are built-in primitives. `Boolean`, `Number`, `String`, `Variant` have no differences with equal data structures of JavaScript, while the `DATA` type is a unique and has no direct analogy in most of the general-purpose programming languages.

## Boolean
In computer science, a **boolean** is a logical data type that can have only the values true or false. In QuokkaScript, boolean conditionals are often used to decide which sections of code to execute (such as in if statements) or repeat (such as in for loops).

```qs
def Page booleanDemo
    Boolean someSetting: true
    Button someButton: Click me!
        .click: ()->{
            if(someSetting){
                // go ahead if someSetting is true
            }
            else{
                // execute if someSetting is true
            }
```

## Number
In QuokkaScript, `Number` is a numeric data type in the [double-precision 64-bit floating point format](https://en.wikipedia.org/wiki/Double-precision_floating-point_format) (IEEE 754), that is corresponding to the ECMAScript standard. There is no specific type for integers.

```qs
def Page numberDemo
    Number pleaseIncreaseMe: 0
    Header:
        Label: {{pleaseIncreaseMe}}
    Button plusOne: +1
        .click: () -> {
                pleaseIncreaseMe++
            }
```

## String
The `String` global object is a constructor for strings or a sequence of characters used to represent any textual data. 

```qs
def Page stringDemo
    String aBoringString: all work and no play makes jack a dull boy
    Header:
        Label: {{aBoringString}}
```
## Variant
In computer science, a **Variant** is a value in memory which is possibly referenced by an identifier and can be used to represent any other data type (for example, Boolean, Number or String).