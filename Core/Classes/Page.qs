@nested

@info: `Page` is one of the most used QuokkaScript elements for creating the user-oriented applications. It defines a simple page on the screen that contains all other [UIComponent](UI.UIComponent) elements. In most cases, a Page itself is not visualized in any manner, unless assigned HTML properties that cause it to be visualized.
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

  @info: Inline CSS property that defines the background colour.
  @example: Redefine the background colour of a single page.
    def Page main
      background: 'linear-gradient(red, yellow)'
  public String background

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
  //  public Boolean fullScreen: true

  @info: Function that shows the `next` Button
  public Function showNext

  @info: Function that enables the `next` Button
  public Function enableNext

  @info: Function that hides the screen keyboard (or navigation buttons). A usage example is demonstrated in the `loaded` event section.
  public Function hideKeyboard

  @info: Function that shows the keyboard
  public Function showKeyboard

  @info: Default container for the `header` component. The header always remains static on top while the other Page content is scrolled.
  public existed ContainerComponent header

  @info: Invisible container used as a hack for storing the global variables. Usable to place a hidden element on the Page.
  public existed ContainerComponent global

  @info: The `loaded`, `firstLoaded`, `reloaded` and `afterShow` represent Page events and are fired when the `Page` is being loaded, loaded for the first time, reloaded or rendered.
  @example: Hide the navigation buttons if Page is loaded for the first time.
      def Page main
          Header.medium: 'A Nice Empty Dashboard'
          .firstLoaded: ()->{
              hideKeyboard();
      }
  public Event loaded

  public Lock transaction

