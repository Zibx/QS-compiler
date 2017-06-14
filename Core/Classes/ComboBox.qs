@ns: UI.Controls
def UIComponent ComboBox

    @example: Label of ComboBox
        ComboBox
            label: choose the color
            items: {
                nk1: 'red',
                nk2: 'green',
                nk3: 'blue'
            }
    @info: Label of ComboBox
    public String label

    @example: Items of ComboBox
        Number count: 0
        ComboBox
            items: {
                nk1: 15,
                nk2: 5467,
                nk3: {{count}}
            }
    @info: items of ComboBox. Syntax is {id1: displayName1, id2: displayName2 ... }
    public Variant items

    @example:
    @info: Current value of ComboBox.
    public Number value