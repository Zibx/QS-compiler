@example: Simple checkbox with label
  CheckBox cb
    caption: I"'"m afraid of cats
    checked: true

@info: Checkbox field, one of the item selection components.

@ns: UI.Controls
def UIComponent CheckBox

  @example: Indicates checked status of the Checkbox
    CheckBox
      label: chkBox
      value: true
  @info: The currently selected value
  public Boolean value: false

  @example: Label of checkbox
    CheckBox
      label: Random box
  @info: Label of checkbox
  public String label