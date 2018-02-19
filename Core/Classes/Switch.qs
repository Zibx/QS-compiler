@nested

@info: The `Switch` UI control serves to input binary values (true/false or 1/0). Looks a little fancier than a checkbox. An initial value (true or false) can be assigned in the declaration.
@ns: UI.Controls
define UIComponent Switch
    @example: An initially checked Switch with a text label. Another Switch sample can be found in the [Input](UI.Controls.Input) element reference.
        Switch sw1: true
            label: I"'"m afraid of cats

    @info: Text label of the Switch, which represents the flag value
    public String label