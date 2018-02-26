# QObject Reference
## Summary
`QObject` is the fundamental parent class in QuokkaScript. All objects in QuokkaScript are descended from `QObject` in a manner similar to JavaScript. Unlike the JavaScript `Object`, the `QObject` supports a reactive behaviour. 

The `QObject` constructor creates an object wrapper for the given value. If the value is `null` or `undefined`, it will create and return an empty object, otherwise, it will return an object of a Type that corresponds to the given value. If the value is an object already, it will return the value.

It is unlikely that you will operate with `QObject` directly in your ordinary work, however, you should keep in mind that each QuokkaScript component consequentially inherits its methods and properties from `QObject.prototype`. The `get()` and `set()` are two principal methods here: the first one just returns the objects value, meanwhile another sets the object properties and notifies all the subscribers on that matter.

`QObject` also contains a destructor, which automatically terminates all the subscriptions while the object is being destroyed. The constructors are called in sequence from parents to children (for example, `QObject -> AbstractComponent -> UIComponent -> Button`). The destructors are called in reverse order, from children to parents (`Button.~destroy -> UIComponent .~destroy -> AbstractComponent .~destroy -> QObject.~destroy`).

## Selected Methods

| Method | Description |
|---|---|
| `get()` | Returns the objects value. |
| `set()` | Calls all the subscribed properties of an object. |
| `extend()` | Implements the inheritance mechanism. |
| `on()` | Implements the event subscription. Returns an object that has an interface to unsubscribe. |
| `once()` | Implements the one-use event subscription. |
| `fire()` | Triggers the event subscriptions. |
| `un()` | Provides a manual event unsubscription. |