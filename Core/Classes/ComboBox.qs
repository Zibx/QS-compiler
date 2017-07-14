@info: Combobox field, one of the item selection components. Contains a list of selectable values and returns the currently selected value.
@ns: UI.Controls
def UIComponent ComboBox

    @example: Label of ComboBox
        ComboBox
            label: choose the color
            items:
                nk1: 'red'
                nk2: 'green'
                nk3: 'blue'

    @info: The label of this ComboBox
    public String label

    @example: Items of ComboBox
        Number count: 0
        ComboBox: nk2
            items:
                nk1: 15
                nk2: 5467
                nk3: {{count}}

    @info: Items (values) of this ComboBox. The syntax is {id1: displayName1, id2: displayName2 ... }
    public Variant items

    @example:
    @info: The current value of the ComboBox
    public String value
