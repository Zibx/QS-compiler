@example: Simple checkbox with label
  CheckBox cb
    caption: I"'"m afraid of cats
    checked: true

@info: Checkbox field, one of the item selection components.

@ns: UI.Controls
def UIComponent CheckBox

  @info: The currently selected value
  public Boolean value: false
