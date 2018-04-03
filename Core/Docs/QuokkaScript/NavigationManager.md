# NavigationManager
NavigationManager is a built-in API that enables to create complicated multipage applications with QuokkaScript. This mechanism is a nice tool when you need to sketch quickly a sophisticated workflow with hundreds of screens and multiway branching. Roughly speaking, it has four essential methods, `navigate()`, `home()`, `back()` and `load()`.

## `navigate()`
Call the `NavigationManager.navigate(pageName)` method to display the indicated `Page` on the screen.  Different [pages](UI.Page) can be declared in one or several `.qs` files within one application. 

**main.qs**
```qs
def Page main
    background: 'linear-gradient(red, black)'
    Header: 'Cool Executive Dashboard'
    Button: 'Issues'
        .click: ()->
            NavigationManager.navigate('Issues')
    Button: 'Meetings'
        .click: ()->
            NavigationManager.navigate('Meetings')
    Button: 'Action Items'
        .click: ()->
            NavigationManager.navigate('ActionItems')
    .firstLoaded: ()->{
        hideKeyboard();
    }
    Button next: Next
        .last: ()->
            NavigationManager.navigate('second')

def Page Issues
    Header.medium: 'Current Issues'

def Page Meetings
    Header.medium: 'Meetings Schedule'

def Page ActionItems
    Header.medium: 'Action Items'
```

**secondPage.qs**
```qs
def Page second
    public String name
    Header.medium: Welcome to the Step 2 of our wizard!
```
### Optional `data` argument
The `NavigationManager.navigate()` method has an optional `data` argument, which can be used to deliver a generic JSON data to the `Page` to be shown next. Of course, this syntax supports a reactive behaviour. The following example offers to input a name to be displayed on the second `Page` of the application.

```qs
def Page main
    TextBox myTextBox: John Doe
        layout: en

    Button next: Next
        .click: ()->
            NavigationManager.navigate('second', {data: {name: myTextBox, role: 'superuser'}})

def Page second
    public String name
    Header.medium: Hello, {{name}}! Your access level is {{role}}.
```

## `home()`, `back()` and `load()`
- The `NavigationManager.home()` method closes the current application and returns a user to the main screen.  
- The `NavigationManager.back()` method loads the previous screen of the current app in a manner similar to the browsers's **Back** button.
- A little bit more advanced usage can be reached with `NavigationManager.loads(anotherApplication)` method. It provides an opportunity to load one QuokkaScript application from another. A user can switch back to the previous app by pushing the `Back` button.

```qs
def Page main
    Header: 'First Page'
    Button next: Next
        .click: ()->
            NavigationManager.navigate('second')
```

```qs
def Page second
    Header.medium: 'Second Page'
    Button: 'Close app and go home'
        .click: ()->
            NavigationManager.home();
    Button: 'Just go back'
        .click: ()->
            NavigationManager.back();
    Button: 'Load another app'
        .click: ()->
            NavigationManager.load('completely_different_app');
```
