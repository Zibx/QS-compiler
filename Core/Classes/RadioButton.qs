@ns: UI.Controls
def UIComponent RadioButton

  @create: if not defined
  public RadioButtonGroup group

  @info: RadioButton value
  public String value

  @info: RadioButton display value. If not setted - value would be used
  public String displayValue

  public Boolean active
