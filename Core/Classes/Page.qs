@nested

@info: Container of other [UIComponent](UI.UIComponent) elements. Typically, it defines a page on the screen. In most cases a Page itself is not visualized in any manner, unless assigned HTML properties that cause it to be visualized.

@ns: UI
define UIComponent Page

  @info: Title of the page in the browser
  public String title

  @info: Data stored in this page. Can be used to store any information related to the page.
  public Variant dataContext

  @info: Show the page in full screen
  public Boolean fullScreen: true

  @info: Function that shows button `next`
  public Function showNext