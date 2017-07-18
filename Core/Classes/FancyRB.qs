@info: RadioButton in a new box, more fancy
@ns: UI.Controls
define UIComponent FlexSizeComponent
    @example: Array of objects with keys and values for radio buttons
        FancyRB frb1
            values: [{key: '1', value: 'red'},
                {key: 'green', value: '2'},
                {key: 'blue', value: ''}]

    @info: Array of objects with keys and values for radio buttons
    public Array values

    @example: A property containing the key of the selected radio button
        FancyRB frb1
            values: [{key: '1', value: 'red'},
                {key: 'green', value: '2'},
                {key: 'blue', value: ''}]
            chosen: 'blue'

    @info: A property containing the key of the selected radio button
    public String chosen

    @example: A method that responds to a change in choice of radio button
        FancyRB frb1
            width: 200px
            values: [{key: 'red', value: 'red'},
                    {key: 'green', value: 'green'},
                    {key: 'blue', value: 'blue'}]
            .onChange: ()->
                br1.background = frb1.value;
        Border br1
            height: 100px
            width: 100px
            background: black

    @info: A method that responds to a change in choice of radio button
    public Event onChange