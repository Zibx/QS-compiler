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
        .click: (evt)->
            if(evt.last){
                NavigationManager.navigate('second')
            }
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

## `home()` and `back()`
`NavigationManager` also 

**main.qs**
```qs
def Page main
    TextBox myTextBox: John Doe
        layout: en

    Button next: Next
        .click: ()->
            NavigationManager.navigate('second', {data: {name: myTextBox}} )

def Page second
    public String name
    Header.medium: Hello, {{name}}!

    Button: home
        .click: ()->
            NavigationManager.home();
    Button: back
        .click: ()->
            NavigationManager.back();
    Button: LOAD                        // load 
            .click: ()->
                NavigationManager.load('completely_different_app');
```

## `load()`
A little bit more advanced usage of 
The `NavigationManager.loads(anotherApplication)` method provides an opportunity to load one QuokkaScript application from another. A user can switch back to the previous app by pushing the `Back` button. 
