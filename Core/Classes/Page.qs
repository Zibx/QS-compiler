@nested

@info: Container of other [[UIComponent]] elements. Typically, it defines a page on the screen. In most cases a Page itself is not visualized in any manner.

@ns: UI
define UIComponent Page
  @info: Browser title of the page.
  public String title

  @info: Data stored in this page. Can be used to store any information related to the page.
  public Variant dataContext

  @info: Show page in full screen
  public Boolean fullScreen: true