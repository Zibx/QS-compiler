@info: Alternative checkbox field looking a bit fancier. An initial value (true or false) can be assigned in the declaration
@ns: UI.Controls
define UIComponent Switch
    @example: An initially checked Switch with a text label
        Switch sw1: true
            label: I"'"m afraid of cats

    @info: Text label of the Switch, which shows the meaning of the flag
    public String label