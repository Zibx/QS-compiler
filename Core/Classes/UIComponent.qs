@info: The base class for most of the visual components. Defines their most basic properties and operations.
    A UIComponent element can be instantiated. It looks like an empty placeholder.
@ns: UI
define AbstractComponent UIComponent

  @info: HTML opacity of the element in the range from 0 to 1
  public Number opacity

  @info: Background color of the element
  public String background

  public String scroll

  public String padding
  public String margin
  public String fontSize

  @info: Height of the element. For example: //100%//, //30px//, //200//, //200*//
  public String height

  @info: Width of the element. For example: //100%//, //30px//, //200//, //200*//
  public String width

  public String top
  public String left

  public String cls

  public String visibility

  public String pureCss

  @info: show element is not ready animation
  public Boolean busy: false
