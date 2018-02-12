@info: "Droplist list in the form of a wheel that can be scrolled. For a good work needs at least one component Wheel and also needs to be called on the screen by it's method show()."
@ns: UI.Controls
define UIComponent WheelPicker
    @example: Set the label
        Button: {{w1}}
            .click: () {
                wp1.show();
            }

        WheelPicker wp1
            label: 'chuuze da doge'
            Wheel w1
                value: 'doge'
                data: ['ovchare','none doge','a hundreeed dogez','any doge','orange doge']

    @info: Label of WheelPicker
    public String label

    @example: Hide the component WheelPicker.
    @info: Method hide() called when user doing tap somewhere on the screen outside the component.
    public Function hide

    @example: Show by click
        Button: {{w1}}
            .click: () {
                wp1.show();
            }

        WheelPicker wp1
            label: 'chuuze da doge'
            Wheel w1
                value: 'doge'
                data: ['ovchare','none doge','a hundreeed dogez','any doge','orange doge']

    @info: Method shows the component on the screen.
    public Function show