@info: Part of the WheelPicker component, needs for good work.
@ns: UI.Controls
define UIComponent Wheel
    @example: Set the value
        Wheel w1
            value: 'doge'
            data: ['ovchare','none doge','a hundreeed dogez','any doge','orange doge']

    @info: Start value of wheel (before user choose smth)
    public String value

    @example: Set values of the wheel
        Wheel w1
            value: 'doge'
            data: ['ovchare','none doge','a hundreeed dogez','any doge','orange doge']

    @info: Array of values for the wheel
    public Array data