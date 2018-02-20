@nested

@info: The `WheelPicker` control includes one or more scrollable lists of distinct values, each of them is represented by a single [Wheel](UI.Controls.Wheel) component and always has one selectable value. `WheelPicker` is often used together with [Input](UI.Controls.Input) control that allows the picker to be displayed at the bottom of the screen instead of a screen keyboard when the user is editing a field or tapping a menu. By default, `WheelPicker` is hidden. Use `show()` and `hide()` methods to show and hide the picker.

@ns: UI.Controls
define UIComponent WheelPicker
    @example: Set a label using the `WheelPicker` component.
        Button: {{w1}}
            .click: () {
                wp1.show();
            }
        WheelPicker wp1
            label: 'chuuze da doge'
            Wheel w1
                value: 'any doge'
                data: ['ovchare', 'none doge', 'a hundreeed dogez', 'any doge', 'orange doge']

    @info: `WheelPicker` label caption
    public String label

    @info: The `hide()` method is automatically called when a user taps somewhere on the screen within the component.
    public Function hide

    @example: Display the `WheelPicker` component by clicking a button.
        Button: {{w1}}
            .click: () {
                wp1.show();
            }
        WheelPicker wp1
            label: 'chuuze da doge'
            Wheel w1
                value: 'any doge'
                data: ['ovchare', 'none doge', 'a hundreeed dogez', 'any doge', 'orange doge']
    @info: Method shows the `WheelPicker` component on the screen.
    public Function show