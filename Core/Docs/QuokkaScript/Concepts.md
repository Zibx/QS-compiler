# Main concepts

The QuokkaScript programming language -- which is further referred to as QS -- is intended to streamline the development of user-oriented **applications** and services. It enables to develop desktop, web, and mobile applications, including distributed applications and those enhanced with a server backend.

The accelerated application development is provided by the following features: \\

  * Clear, intuitive, and extensible model of encapsulated **components**
  * Simple minimalistic syntax with a weak type system
  * Native support for **“reactive”** references of properties to other properties, i.e. automatic changing of referring values whenever the referred values change
  * Native support for **event** subscription, triggering, and catching
QS is a cross-platform script language that looks like a hybrid of YAML, JavaScript, and Python and feels like a hybrid of Excel and Visual Basic. In the same time it is conceived to ultimately facilitate writing of code and training of the developer’s skills while using this programming language. Therefore, it is expected that programming in QS will not require as much skill and/or time as the recognized industry standard programming languages.

A QS application mainly consists of declarations of **elements**, which are analogous to objects. Elements are instances of **components**, which are analogous to classes. Components serve as **types** along with basic **data types** such as string, boolean, number, etc. A component must inherit from one of the basic QS components to take full advantage of the above-mentioned features of the language.\\

Basically, each component has **properties** and **functions**. A property is a named variable. Changing of a property value in an element can make the system perform a number of predefined actions such as function execution, reactive changing of other properties, activation of subscribed objects, etc. A function is analogous to a class method and resembles a JavaScript function. **Event handlers** are declared as functions in elements.

[x] Finish my changes
[ ] Push my commits to GitHub
[ ] Open a pull request

@github/support What do you think about these updates?

@octocat :+1: This PR looks great - it's ready to merge! :shipit:

1. Make my changes
  1. Fix bug
  2. Improve formatting
    * Make the headings bigger
2. Push my commits to GitHub
3. Open a pull request
  * Describe my changes
  * Mention all the members of my team
    * Ask for feedback

[Contribution guidelines for this project](docs/CONTRIBUTING.md)

This site was built using [GitHub Pages](https://pages.github.com/).

Use `git status` to list all new or modified files that haven't yet been committed.


In the words of Abraham Lincoln:

> Pardon my French


markdown       | `completed` property of | `typeof token.completed` | `task` property of
               | list_item_start token   |                          | corresponding text token
---------------|-------------------------|--------------------------|------------------------
* an item      |                         | 'undefined'              | an item
* [x] did it   | true                    | 'boolean'                | did it
* [v] this too | true                    | 'boolean'                | this too
* [ ] to-do    | false                   | 'boolean'                | to-do

| Heading 1 | Heading 2
| --------- | ---------
| Cell 1    | Cell 2
| Cell 3    | Cell 4

| Header 1 | Header 2 | Header 3 | Header 4 |
| :------: | -------: | :------- | -------- |
| Cell 1   | Cell 2   | Cell 3   | Cell 4   |
| Cell 5   | Cell 6   | Cell 7   | Cell 8   |

    Test code

Header 1 | Header 2
-------- | --------
Cell 1   | Cell 2
Cell 3   | Cell 4

Header 1|Header 2|Header 3|Header 4
:-------|:------:|-------:|--------
Cell 1  |Cell 2  |Cell 3  |Cell 4
*Cell 5*|Cell 6  |Cell 7  |Cell 8