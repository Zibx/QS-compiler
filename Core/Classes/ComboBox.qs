@info Combobox field, one of the item selection components. Contains a list of selectable values and returns the currently selected value.
@ns: UI.Controls
def UIComponent ComboBox

    @info: The label of this ComboBox
    public String label

    @info: Items (values) of this ComboBox. The syntax is {id1: displayName1, id2: displayName2 ... }
    public Variant items

    @info: The current value of the ComboBox
    public Number value
