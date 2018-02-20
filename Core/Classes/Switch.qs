@nested

@info: The `Switch` UI control serves to set binary attributes (**true** vs **false** or **1** vs **0**). Looks a little fancier than a [CheckBox](UI.Controls.CheckBox). An initial value (true or false) can be assigned in the declaration.

@ns: UI.Controls
define UIComponent Switch
    @example: An initially checked `Switch` with a text label. Another `Switch` sample can be found in the [Input](UI.Controls.Input) element reference.
        Switch sw1: true
            label: I"'"m afraid of cats

    @info: The `Switch` label
    @example: The `Switch` label sample
        CheckBox
            label: A random switch
    public String label

    @info: The `Switch` flag value, can be either `'checked'` or `false`
    public String value