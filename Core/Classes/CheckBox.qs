@nested

@info: The `CheckBox` UI control serves to set binary attributes (**true** vs **false** or **1** vs **0**). The `CheckBox` behaves in a similar fashion to the [Switch](UI.Controls.Switch) control except that has a different view.  An initial value (true or false) can be assigned in the declaration.
@example: An initially checked `CheckBox` with a text label.
    CheckBox cb
        caption: I"'"m afraid of cats
        checked: true

@ns: UI.Controls
def UIComponent CheckBox

  @example: Indicates checked status of the Checkbox
    CheckBox
      label: chkBox
      value: true
  @info: The currently selected value
  public Boolean value: false

  @example: The `Checkbox` label sample
    CheckBox
      label: Random box

  @info: The `Checkbox` label
  public String label
