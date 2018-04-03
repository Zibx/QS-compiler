@info: The base class for most of the visual components. Defines their most basic properties and operations.
    A UIComponent element can be instantiated. It looks like an empty placeholder.
@ns: UI
define AbstractComponent UIComponent

  @info: HTML opacity of the element in the range from 0 to 1
  public Number opacity

  @info: Background color of the element
  public String background

  @info: Should content be scrollable? Enum. Values: horizontal, vertical, both, disabled
  public String scroll

  @info: css padding
  public String padding

  @info: css margin
  public String margin

  @info: css fontSize
  public String fontSize

  @info: Height of the element. For example: 100%, 30px, 200, 200*
  public String height

  @info: Width of the element. For example: 100%, 30px, 200, 200*
  public String width

  @info: Elements top. Can be used in position based layouts
  public String top

  @info: Elements left. Can be used in position based layouts
  public String left

  @info: css classes
  public String cls

  @info: Element display style. Enum:
      - [visible] - default
      - flex
      - hidden - do not show,
      - collapsed - hide and collapse space
  public String visibility

  @info: Hack making property. Inline native css style. Danger. Try to avoid.
  public String pureCss

  @info: show element is not ready animation
  public Boolean busy: false

  @info: Return actual dimensions in pixels in format: {width: x, height: y}
  public Function getSize

  @info: The grid-row CSS property is a shorthand property for grid-row-start and grid-row-end specifying a grid item’s size and location within the grid row by contributing a line, a span, or nothing (automatic) to its grid placement, thereby specifying the inline-start and inline-end edge of its grid area.
  public String gridRow

  @info: The grid-column CSS property is a shorthand property for grid-column-start and grid-column-end specifying a grid item's size and location within the grid row by contributing a line, a span, or nothing (automatic) to its grid placement, thereby specifying the inline-start and inline-end edge of its grid area.
  public String gridColumn