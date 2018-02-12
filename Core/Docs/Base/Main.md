# QuokkaScript Crash Course
Raw time estimate - 45 minutes.

This tutorial was designed specifically for developers, who are completely new to QuokkaScript and prefer a quick tour to get started with a new library and a runtime framework.

## Step 1 - Why QuokkaScript?
QuokkaScript is a [Domain-Specific Language](https://en.wikipedia.org/wiki/Domain-specific_language) that is addressed to both technical and non-technical people helping them in the creation of modern adaptive and flexible applications. In contrast to most general purpose languages (like JavaScript), QuokkaScript is best suited to streamline the development of user-oriented applications working with various software and hardware components and external services like databases or APIs.

Typical tasks best fit with QuokkaScript:
- Creating software for embedded systems (ATMs, digital kiosks, self-service terminals, etc).
- Quick prototyping of applications with complicated GUI.
- Creating Electron-like Desktop apps for multiple platforms.
- Creating interactive presentations with advanced scripts requiring interaction with external hardware or software.

In these conditions, QuokkaScript is **not well-suited** for creating such things as complicated games, native mobile apps and complex backend solutions. You will not be able to build an ERP system with only QuokkaScript, however, QuokkaScript is a reasonable tool to sketch a sophisticated workflow with hundreds of screens and multiway branching.

## Step 2 - Install QuokkaScript

## Step 3 - Overview the Basics
QuokkaScript simplifies many of typical JavaScript complexities through the using of [declarative programming](https://en.wikipedia.org/wiki/Declarative_programming) approach. Around of 95% of code lines of an ordinary QuokkaScript application are declarations that describe objects properties or visual markup. At the same time, all tasks related to application behaviour logic can be implemented using JavaScript code snippets.

For example, a simple mortgage calculating widget can be implemented in pure QuokkaScript using declarative style. In all other cases, QuokkaScript syntax allows one inserting JavaScript everywhere.

```
def Page myFirstPage
    Button: Next
        .click: () -> {
            next()
        }

// Explaination:
// =============
// On the button’s click event, myFirstPage.next() method is called.
// A button itself does not have the ‘next()’ method.
```

A QuokkaScript application mainly consists of **elements**, which are equivalent to objects. **Elements** are instances of **components**, which are equivalent to classes. Components serve as **types** along with basic **data types** such as string, boolean, number, etc. A **component** must be inherited from one of the basic QuokkaScript **components** to take full advantage of the language.

Basically, each **component** has **properties** and **functions**. A **property** is a **named variable**. Changing of a **property value** in an **element**, one can make the system perform a number of predefined actions such as function execution, reactive change of other properties, activation of subscribed objects, etc. A **function** is equivalent to a class method and resembles a JavaScript function. **Event handlers** are declared as **functions** in **elements**.

Other special aspects of QuokkaScript syntax:
- All names in QuokkaScript are case sensitive.
- All elements are declared in a parent-child hierarchy.
- Nested declarations are marked up with line indents. Event handlers code snippets are not.
- No semicolons required at the end of lines. No curly braces to define a block (except for event handlers).

## Step 4 - Element declarations
The most frequent expressions of QuokkaScript are the **element declarations**. Properties, event handlers, and child elements can be declared inside each **element**.

QuokkaScript syntax does not require curly braces to delimit the content of **elements**: indentation defines the nesting level of statements and operators, like in YAML and Python. Nonetheless, curly braces are used in the syntax:
  - Around procedural blocks in event handlers (optionally)
  - Around JSON-like data declarations (mandatory)
  - Around reactive property reference expressions (double curly braces are mandatory)

A declaration, a statement, or an operator can occupy only one line. The end of the line serves as the end of the operator or statement, thus eliminating the need for a semicolon ‘;’.

An example of a QuokkaScript code is presented below. It defines a page with coloured background and places an interactive map object inside, which will occupy 50% of the page height and width. The map is centred at a predefined geographical point, has a predefined zoom, and automatically sets a pin mark in the point indicated by `list.selectedItem` (when the user selects one in the `list` element which is omitted in this example).

```
def Page main
   title: Tourist map
   background: blue

   GeoMap gm
      zoom: 11
      home: [55.794425,37.587836]
      pins: {{[list.selectedItem]}}
      height: 50%
      width: 50%
……
```

## Step 5 - Components and Data Types
**Components** are equivalent to classes, meanwhile **component instances** are equivalent to **elements**.

In the example above, an element `main` representing the component [Page](UI.Page) is declared; it serves as a container for other elements: in particular, `gm` of the component [GeoMap](UI.Controls.GeoMap). Other declarations shown in the example are **variable declarations**. Indentation clearly indicates the hierarchy of nested elements and variables.

Syntactically, components serve as data types. Thus, an **element** of any **component** is a variable of the data type represented by that **component**. Just as classes in most programming languages, **components** are organized in a hierarchical system linked by inheritance. When you define your own QuokkaScript **component** you must derive it from another existing component.

QuokkaScript also includes predefined primitive **data types**, which are other than **components**:

| **Data type** | **Description** | **Sample** |
|---|---|---|
| **String** | String value. Uses the JavaScript syntax for String. | `Example string` |
| **Number** | Number value. Uses the JavaScript syntax for numbers, including integer and fixed-point numbers. | `42` or `-4.20` |
| **Boolean** | Boolean value can be either true or false. Uses the JavaScript syntax for Boolean. | `True` or `False` |
| **Variant** | Value that can contain multiple values of different types. Uses JSON syntax. | `{a: 1, b: 2}` |
| **Array** | Array of values. Uses the JavaScript syntax for arrays. | `[‘foo’, 123]` |
| **Function** | Function. Uses the JavaScript syntax for functions. | `(args)->body` or `(a)->{ b;c}` or `function(args){ body }` |

**NB** Data types are not components. However, QuokkaScript Syntax treats components and data types in the same way.

## Step 6 - Hello World!
Enough theory. Nothing creates the illusion of understanding as an example, so let's have a look at the obligatory Hello World in QuokkaScript to illustrate some of the basic concepts introduced above.

```
def Page main                            // root Page element named ‘main’
    public String foo                    // a public string variable
    TextInput i1: type your text here    // a text field initialised with a String value
    HBox                                 // an Hbox with no name (not to be referenced)
    width: 100%                          // redefinition of a prototype property value
    Image img:                           // an element, which values follow below:
        stretch: none                    //
        source: 'https://my_url/'        //
    Button myButton: 'Say Hello World!'  // a button with a caption (default property)
```

**Elements hierarchy**
All elements should be declared in a parent-child hierarchy. Declare parents then nest children inside:
```
def Page main
    vbox Layout
```
**Only indent that matters**
```
ComponentX elementX
    ComponentY elementY
        propertyA: valueA
    propertyB: valueB
```

- Nested declarations (but not event handlers code) are marked up with line indents. In the example above, `propertyA` belongs to `ComponentY` and `propertyB` belongs to `ComponentY`

## Step 7 - Basic Constructions
Overview:
- Element declaration
- CSS class definition
- Property declaration
- Function declaration
- Event handler declaration
- Redefinition of a function
- Reactive property reference
- Reacting to events
- Subscription to property modification


**Elements Hierarchy**

All elements should be declared in a parent-child hierarchy. Declare parents then nest children inside:
```
def Page main
    vbox Layout
```
**Only indent that matters**

```qs
ComponentX elementX
    ComponentY elementY
        propertyA: valueA
    propertyB: valueB
```

- Nested declarations (but not event handlers code) are marked up with line indents. In the example above, `propertyA` belongs to `ComponentY` and `propertyB` belongs to `ComponentY`.

**Common Declaration Syntax** (not including events)
```
[def | public ] [Type] [name [: [value]]]
```

- In an element declaration, `Type` stands for the component name, and `value` is the value of the default property, which is always named `value`.
- In a property declaration, `Type` stands for the data type, and `value` is the property value.
- The `public` modifier has to be added to make an element or property unusable in other elements.

**Property Reference**
- As the value of `prop_name`  changes, the referencing element and the corresponding appearance changes automatically.

```qs
Video video1
    time: {{progresSlider}}
Slider progresSlider
    from: 0
    to {{video1.duration}}
```

- `[element_name.]prop_name` is a property reference (copying the value)
- `element_name` is a reference to default value
- `{{[element_name.]prop_name}}` is a reactive property reference (watching the value)

**Event Handler Declaration**
```
.event: ()-> {/* handler body for event 'event'*/}
```
- It's where the procedures are defined
- The event handler body has to be written in javaScript and can take multiple lines. Curly braces and semicolons must be used in this case.

```
def Page myFirstPage
    Button: Next
        .click: () -> {
            next()
        }
```

**Property Reference From Procedures**
- Use JavaScript-style getters and setters inside procedures.

```
myInput.get('text')           // get the text value
myInput.set('time', 15.46)    // set the time value
```

## Step 8 - QuokkaScript Built-In Components

**Layout Components**

| **Component** | **Description** |
|---|---|
| `Page` | Page containing all other GUI elements |
| `Hbox`, `Vbox` | Horizontally and vertically oriented stacks |
| `Image` | Graphical image |
| `Button` | Push button |
| `Grid` | Grid with addressable rows and columns |

**Item Selection Components**

| **Component** | **Description** |
|---|---|
| `ListBox` | Vertical or horizontal list of selectable items |
| `WrapPanel` | Ordered set of selectable items |
| `Checkbox` | Binary attribute |
| `RadioButton` | Selectable option, child of a `RadioButtonGroup` |

**Value Input Components**

| **Component** | **Description** |
|---|---|
| `TextBox` | Text input with the corresponding keyboard |
| `NumberBox` | Number input with the corresponding keyboard |
| `Slider` | Draggable slider |

**Gadget Components**

| **Component** | **Description** |
|---|---|
| `Video` | Plays video and audio |
| `Audio` | Plays audio without a visualization |
| `GeoMap` | Displays a Google or Yandex interactive map  |
