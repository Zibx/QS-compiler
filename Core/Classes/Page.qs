@nested

@info: Container of other [UIComponent](UI.UIComponent) elements. Typically, it defines a page on the screen. In most cases, a Page itself is not visualized in any manner, unless assigned HTML properties that cause it to be visualized.
@example: Create root page element named 'main'
  def Page main
    div:
      padding: 25px 45px 25px 70px
      Header.big: 'All work and no play makes Jack a dull boy'
        margin: 0 0 21px 0
      Label.lead: 'All work and no play makes Jack a dull boy'
        padding: 0 170px 0 0

@ns: UI
define UIComponent Page

  @info: Title of the page in the browser
  public String title

  @info: Data stored on this page. Can be used to store any information related to the page.
  public Variant dataContext

  //- @info: `Page` display mode (full screen or windowed)
  //- @example: Switch from full screen to windowed mode
  //-   def Page main
  //-     Button btn: Full screen OFF
  //-       .click: () -> {
  //-         if (main.fullScreen) {
  //-           main.fullScreen = false;
  //-           this.value = 'Full screen ON';
  //-         } else {
  //-           main.fullScreen = true;
  //-           this.value = 'Full screen OFF';
  //-         }
  //-         console.log('main.Data');
  //-       }

  @info: Function that shows the `next` Button
  public Function showNext

  @info: Function that enables the `next` Button
  public Function enableNext

  //- @info The `next` button
  //- public Button next

  //- @info The `back` button
  //- public Button back

  @info: Container for the `header` component
  public existed ContainerComponent header

  @info: Container for global variables
  public existed ContainerComponent global

  @info: Function that show a keyboard
  public Function showKeyboard

  @info: Function that hide a keyboard
  public Function hideKeyboard
