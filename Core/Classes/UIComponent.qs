@info: The base class for most of the visual components. Defines their most basic properties and operations. A UIComponent element can be instantiated. It looks like an empty placeholder
@ns: UI
define AbstractComponent UIComponent
  @info: Transparency of element in range [0-1]
  public Number opacity

  @info: Background color of the element
  public String background

  public String scroll

  public String padding
  public String margin
  public String fontSize

  @info: Height of the element
  public String height

  @info: Width of the element
  public String width

  public String cls

  public String visibility