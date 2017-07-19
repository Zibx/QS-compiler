# QuokkaScript documentation root

## Introduction
&nbsp;

QuokkaScript (QS) is a programming language created by a team of experienced enthusiasts seeking to facilitate the application development process for the widest possible audience of developers - including those who are not very experienced but are willing to create modern adaptive and flexible apps.
&nbsp;

QuokkaScript is not just a language but also a runtime framework and a library of ready-to-use components, which make up a full SDK.
&nbsp;

This document is a manual of the QS language and library. Referring to this manual should be sufficient to be able to write QuokkaScript applications. Knowledge of JavaScript will significantly help the reader understand the language and this manual.
&nbsp;

## QuokkaScript language
&nbsp;

### Main concepts
&nbsp;

The QuokkaScript programming language -- which is further referred to as QS -- is intended to streamline the development of user-oriented **applications** and services. It enables the development of desktop, web, and mobile applications, including distributed applications and those enhanced with a server backend.
&nbsp;

The accelerated application development is provided by the following features:
  - Clear, intuitive, and extensible model of encapsulated **components**
  - Simple minimalistic syntax with a weak type system
  - Native support for **reactive** references of properties to other properties, i.e. automatic changing of referring values whenever the referred values change
  - Native support for **event** subscription, triggering, and catching
&nbsp;

QS is a cross-platform script language that is similar to YAML, JavaScript, and Python. In the same time it is conceived to ultimately facilitate writing of code and training of the developer’s skills while using this programming language. Therefore, it is expected that programming in QS will not require as much skill and/or time as the recognized industry standard programming languages.
&nbsp;

A QS application mainly consists of declarations of **elements**, which are analogous to objects. Elements are instances of **components**, which are analogous to classes. Components serve as **types** along with basic **data types** such as string, boolean, number, etc. A component must inherit from one of the basic QS components to take full advantage of the above-mentioned features of the language.
&nbsp;

Basically, each component has **properties** and **functions**. A property is a named variable. Changing of a property value in an element can make the system perform a number of predefined actions such as function execution, reactive changing of other properties, activation of subscribed objects, etc. A function is analogous to a class method and resembles a JavaScript function. **Event handlers** are declared as functions in elements.
&nbsp;

### Syntax and data model
&nbsp;

The QS syntax is similar to that of YAML.
&nbsp;

Typically, a QS script consists of element declarations. Inside elements, its properties, event handlers, and child elements can be declared.
&nbsp;
QS does not require curly braces to delimit the content of elements: indentation defines the nesting level of statements and operators, like in YAML and Python. Nonetheless, curly braces are used in the syntax:
  - Around procedural blocks in event handlers (optionally)
  - Around JSON-like data declarations (mandatory)
  - Around reactive property reference expressions (double curly braces are mandatory)
  &nbsp;

A declaration, a statement, or an operator can only occupy one line. The end of the line serves as the end of the operator or statement, thus eliminating the need of a semicolon ';'.
&nbsp;

An example of a QS code is presented below. It defines a page with colored background and places an interactive map object inside, which will occupy 50% of the page height and width. The map is centered at a predefined geographical point, has a predefined zoom, and automatically sets a pin mark in the point indicated by `list.selectedItem` (when the user selects one in the `list` element which is omitted in this example).
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
......
```

#### Components
&nbsp;

Components are the analog of classes. In the example above, an element `main` representing the component [Page](UI.Page) is declared, which serves as a container for other elements: in particular, `gm` of the component [GeoMap](UI.GeoMap). Other declarations shown in the example are variable declarations. Indentation clearly indicates the hierarchy of nested elements and variables.
&nbsp;

From the syntax point of view, components serve as data types. Thus, an element of any component is a variable of the data type represented by that component. Just as classes in most programming languages, components are organized in a hierarchical system linked by inheritance. When you define your own QS component you must derive it from another existing component.
&nbsp;

#### Data types
QuokkaScript has also predefined primitive data types, which are not components:
&nbsp;

| |
| ---------  | ---------
| **String**   | String value. Uses the Javascript syntax for String
| **Number**	 | Number value. Uses the Javascript syntax for numbers, including integer and fixed point numbers
| **Boolean**  | Boolean value, can be either true or false. Uses the Javascript syntax for Boolean
| **Variant**  | Value that can contain multiple values of different types. Uses JSON syntax
| **Function** | Function. Uses the Javascript syntax for functions
| **Array**    | Array of values. Uses the Javascript syntax for arrays
&nbsp;

### Basic constructions
&nbsp;

#### Element declaration
&nbsp;

The basic syntax to declare an element (i.e. an instance of a component) is as follows:
```
Component elementName
```

However, first level elements are declared with an additional `def` keyword, for example:
```
def LogicalComponent myLogic
```

You must mind the appropriate indentation so that the child element declaration has a greater indent than its parent element declaration. For example:
```
def Page main //the main page is the root container
  ContainerComponent foo //foo is a child of main
  ... //possible declarations of foo properties
    UIComponent bar //bar is a child of foo
    ... //possible declarations of bar properties
```

#### CSS class definition
&nbsp;

Behaving in a similar way as HTML elements, QuokkaScript elements can also be styled with CSS classes. If the CSS library deployed with your current SDK contains stylesheet classes, you can specify them as part of element declarations, for example:
```
  CardForm.card-form myCardForm
```
In the example above, a [CardForm](UI.CardForm) element named `myCardForm` has the class `card-form`. This class defines the visual appearance and behavior of `myCardForm`.
Class specifications allow the developer to avoid redundant definitions of style attributes, especially on complex components, such as [CardForm](UI.CardForm) in the above example.
&nbsp;

#### Property declaration
&nbsp;

The property declaration syntax is basically the same as the component declaration syntax. However, it has extensions allowing properties to be initialized or making them publicly visible from other elements.
&nbsp;

A property declaration generally includes:
  - Optional scope specifier `public`
  - Data type name or component name
  - Property name
  - Optionally, the initialization token ':' followed by an initialization expression
  &nbsp;

For example:
```
public Boolean flagged: false
```

Properties are declared as part of their components declarations, in the nested block of code, for example:
```
def LogicalComponent myLogic
  public Boolean flagged: false
  //other declarations being part of this element
```

Having the above declaration, `myLogic` element will have a publicly referrable boolean property `flagged`, which will initially have the `false` value.
&nbsp;

#### Function declaration
&nbsp;

Like properties, functions are members of elements and must be declared on the same nesting level as part of an element's declaration.
&nbsp;

Functions are declared and defined as follows:
```
Function foo(param1, param2, ...) {
	//function code
	}
```

> Note: **Function** is a data type, and `foo` in the above example is an instance (a variable) of the **Function** data type, and therefore `foo` is a function. The curly braces play the same role as in JavaScript and define the function body. A colon ':' is not required in function definitions.
&nbsp;

It is unlikely that you will have to define functions in the way described above. More likely will be event handlers declaration.
&nbsp;

#### Event handler declaration
&nbsp;

An event handler is a function that is bound to a specific known event which can be caught by the component. A event handler specifies the name of the event and defines the handler function code. Its syntax is illustrated in the example:
```
//”click” is the name of the event to handle

.click:()-> 1st line of the handler code
  2nd line of the handler code
  ... etc.
```

The handler function code must have the JavaScript syntax.
&nbsp;

You can optionally embrace the function code with curly braces:
```
.click:()-> {... // handler code
  ... //handler code
  }
```

#### Redefinition of a function
&nbsp;

Once defined, a function can be redefined in child components. The syntax of redefinition is the same as of event handlers For example, if some function `foo` was previously declared, the function redefinition can be as follows:
```
.foo:()->{
  // new function body for foo
  }
```

Redefinition of parameters is not allowed in function redefinitions, so the parentheses ( ) must be empty in this case.
&nbsp;

#### Reactive property reference
&nbsp;

A property can be assigned with another property not by value but by reference, using the *reactive property reference* syntax, which uses double curly braces:
```
public MyControl ctrl: {{other_ctrl.value}}
```

Reactive reference means that when the value of the referenced property changes, so automatically does the value of the referencing property. Such a behavior is very helpful from the viewpoint of delivering interactivity to your application, since it does not require any extra coding to make visual components react to each other.
&nbsp;

In the example below, the main page shows an input field `input` and a slider `slide` which has the integer range from *0* to *100*. The initial slider value is *10*. As the user moves the slider and changes its value, the value of `input` will be maintained by the system always equal to the current value of `slide` (due to the reactive reference) and will be automatically updated on the screen.
```
def Page main
	TextBox input: {{slide.value}}
	Slider slide: 10
		from: 0
		to: 100
```

#### Reacting to events
&nbsp;

Elements can react to events that are related with them. For example, all visual elements (descendants of [UIComponent](Core.UIComponent)) can react to `click`, `mouseenter`, and `mouseleave` events, as well as some other ones. Events that a component is sensible to are listed in the corresponding component description section in the QuokkaScript components reference.
&nbsp;

To define the reaction of an element to an event, you must declare the event handler function as described in Event handler declaration above. For example, you should declare reaction to the click event as follows:
```
MyComponent myElement
  .click:()->
    this.value = calculateValue()
```

For more information, please refer to the chapter Event handler declaration.
&nbsp;

#### Subscription to property modifications
&nbsp;

A component instance can be subscribed to an event of property changing. To enable subscribing of a component instance to the `_onPropertyChanged` event, the subscriber component must provide a callback function that accepts parameters:
  - The instance whose property has changed
  - The name of the changed property
  - The new value
  - The old value
  &nbsp;

It is the event initiating component that subscribes other components and their callback functions to changes of its properties. The initiating component must inherit from [AbstractComponent](Core.AbstractComponent). If it does, it can use the following function call to subscribe a callback function to `this._onPropertyChanged` event:
```
subscribe(callback)
```

Every modification of this component’s properties will invoke the subscribed callback function with the four parameters listed above.
&nbsp;

## QuokkaScript components
&nbsp;