@info: Input control allowing the user to select values from a numeric range by dragging a horizontal slider

@example: Usage example
    def Page main

        // The pag\e color is controlled by three sliders below
        background: rgb({{s1}}, {{s2}}, {{s3}})

        VBox
            // This slider controls the red component of the page color
            Slider s1: 127
                from: 0
                to: 255
                step: 1
                fillColor: rgb({{s1}}, 0, 0)
            Label: 'Red:' {{s1}}

            // This slider controls the green component of the page color
            Slider s2: 127
                from: 0
                to: 255
                step: 1
                fillColor: rgb(0, {{s2}}, 0)
            Label: 'Green:' {{s2}}

            // This slider controls the blue component of the page color
            Slider s3: 127
                from: 0
                to: 255
                step: 1
                fillColor: rgb(0, 0, {{s3}})
            Label: 'Blue:' {{s3}}

@ns: UI.Controls
def UIComponent Slider

    @example: Lower bound of range
        VBox
            height: 100px
            Slider s1
                width: 500px
                from: -20

            Label: {{s1}}
    @info: Lower bound of range
    public Number from

    @example:
        VBox
            height: 100px
            Slider s1
                width: 500px
                to: 100

            Label: {{s1}}
    @info: Upper bound of range
    public Number to

    @example: Set the step of slider
        VBox
            height: 100px
            Slider s1
                width: 500px
                step: 10

            Label: {{s1}}
    @info: Step of the values while moving the slider.
    public Number step

    @example: Color of the Filled part of the slider
        Slider
            width: 500px
            fillColor: #0f0
    @info: Color of the Filled part of the slider
    public String fillColor

    @example: Current value
        VBox
            height: 100px
            Slider s1
                width: 500px
                to: 200
                value: 75

            Label: {{s1}}
    @info: Current value of slider. You can also set this property, using a value from the current range //from-to//. The slider position will be automatically updated.
    public Number value