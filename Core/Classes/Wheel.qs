@nested

@info: The `Wheel` component serves to pick one item from a scrollable list. Most often it is used as a part of the [WheelPicker](UI.Controls.WheelPicker) control.

@ns: UI.Controls
define UIComponent Wheel
    @example: Pick one value sample.
        Wheel w1
            value: 'any doge'
            data: ['ovchare', 'none doge', 'a hundreeed dogez', 'any doge', 'orange doge']

    @info: Default picker value. Does not has to be an element of the list.
    @example: Default picker value sample.
        Wheel w1
            value: 'doge'
            data: ['ovchare', 'none doge', 'a hundreeed dogez', 'any doge', 'orange doge']
    public String value

    @info: The collection to be represented visually as a scrollable list.
    public Array data

    @info: Binary attribute defining the visibility of a `Wheel` control.
    public Boolean visible