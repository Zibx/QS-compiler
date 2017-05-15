#   Basic constructions
##  Element declaration
The basic syntax to declare an element (i.e. an instance of a component) is as follows:
```qs
Component elementName
```

However, first level elements are declared with an additional `def` keyword, for example:
```qs
def LogicalComponent myLogic
```

You must mind the appropriate indentation so that the child element declaration has a greater indent than its parent element declaration. For example:
```qs
def Page main //the main page is the root container
  ContainerComponent foo //foo is a child of main
  ... //possible declarations of foo properties
    UIComponent bar //bar is a child of foo
    ... //possible declarations of bar properties
```

#  CSS class definition
Behaving in a similar way as HTML elements, QuokkaScript elements can also be styled with CSS classes. If the CSS library deployed with your current SDK contains stylesheet classes, you can specify them as part of element declarations, for example:\\
```qs
  CardForm.card-form myCardForm
```
In the example above, a [[CardForm]] element named //myCardForm// has the class //card-form//. This class defines the visual appearance and behavior of //myCardForm//.\\
Class specifications allow the developer to avoid redundant definitions of style attributes, especially on complex components, such as [[CardForm]] in the above example.

#  Property declaration
The property declaration syntax is basically the same as the component declaration syntax. However, it has extensions allowing properties to be initialized or making them publicly visible from other elements.\\
\\
A property declaration generally includes:

  * Optional scope specifier //public//
  * Data type name or component name
  * Property name
  * Optionally, the initialization token ‘:’ followed by an initialization expression

\\
For example:
```qs
public Boolean flagged: false
```

Properties are declared as part of their components declarations, in the nested block of code, for example:
```qs
def LogicalComponent myLogic
  public Boolean flagged: false
  //other declarations being part of this element
```

Having the above declaration, //myLogic// element will have a publicly referrable boolean property //flagged//, which will initially have the //false// value.

#  Function declaration
Like properties, functions are members of elements and must be declared on the same nesting level as part of an element's declaration.\\
\\
Functions are declared and defined as follows:
```qs
Function foo(param1, param2, ...) {
	//function code
	}
```

Note: //Function// is a data type, and //foo// in the above example is an instance (a variable) of the //Function// data type, and therefore //foo// is a function. The curly braces play the same role as in JavaScript and define the function body. A colon ‘:’ is not required in function definitions.\\
\\
It is unlikely that you will have to define functions in the way described above. More likely will be event handlers declaration.\\
\\
#  Event handler declaration
An event handler is a function that is bound to a specific known event which can be caught by the component. A event handler specifies the name of the event and defines the handler function code. Its syntax is illustrated in the example:
```qs
//”click” is the name of the event to handle

.click:()-> 1st line of the handler code
  2nd line of the handler code
  ... etc.
```

The handler function code must have the JavaScript syntax.
You can optionally embrace the function code with curly braces:
```qs
.click:()-> {... // handler code
  ... //handler code
  }
```

#  Redefinition of a function
Once defined, a function can be redefined in child components. The syntax of redefinition is the same as of event handlers For example, if some function //foo// was previously declared, the function redefinition can be as follows:
```qs
.foo:()->{
  // new function body for foo
  }
```

Redefinition of parameters is not allowed in function redefinitions, so the parentheses ( ) must be empty in this case.\\
\\
#  Reactive property reference
A property can be assigned with another property not by value but by reference, using the **reactive property reference** syntax, which uses double curly braces:
```qs
public MyControl ctrl: {{other_ctrl.value}}
```

Reactive reference means that when the value of the referenced property changes, so automatically does the value of the referencing property. Such behavior is very helpful from the viewpoint of delivering interactivity to your application, since it does not require any extra coding to make visual components react to each other.\\
\\
In the example below, the main page shows an input field //input// and a slider //slide// which has the integer range from 0 to 100. The initial slider value is 10. As the user moves the slider and changes its value, the value of //input// will be maintained by the system always equal to the current value of //slide// (due to the reactive reference) and will be automatically updated on the screen.
```qs
def Page main
	TextBox input: {{slide.value}}
	Slider slide: 10
		from: 0
		to: 100.3
```
#  Reacting to events
Elements can react to events that are related with them. For example, all visual elements (descendants of [[UIComponent]]) can react to //click//, //mouseenter//, and //mouseleave// events, as well as some other. Events that a component is sensible to are listed in the corresponding component description section in the QuokkaScript components reference.\\
\\
To define the reaction of an element to an event, you must declare the event handler function as described in Event handler declaration above. For example, you should declare reaction to the click event as follows:
```qs
MyComponent myElement
  .click:()->
    this.value = calculateValue()
```

For more information, please refer to the chapter Event handler declaration.\\

#  Subscription to property modifications
A component instance can be subscribed to an event of property changing. To enable subscribing of a component instance to the //_onPropertyChanged// event, the subscriber component must provide a callback function that accepts parameters:
  * The instance whose property has changed
  * The name of the changed property
  * The new value
  * The old value
It is the event initiating component that subscribes other components and their callback functions to changes of its properties. The initiating component must inherit from [[AbstractComponent]]. If it does, it can use the following function call to subscribe a callback function to //this._onPropertyChanged// event:
```qs
subscribe(callback)
```

Every modification of this component’s properties will invoke the subscribed callback function with the four parameters listed above.


