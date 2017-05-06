@ns: UI.Controls
def UIComponent ComboBox

    @info: Label of ComboBox
    public String label

    @info: items of ComboBox. Syntax is {id1: displayName1, id2: displayName2 ... }
    public Variant items

    @info: Current value of ComboBox.
    public Number value