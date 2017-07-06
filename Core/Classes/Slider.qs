@info: Input control allowing the user to select values from a numeric range by dragging a horizontal slider

@example: Setting page background with three sliders (RGB)
  '''qs
    def Page main

        // The page color is controlled by three sliders below
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
  '''

@ns: UI.Controls
def UIComponent Slider

    @info: Lower bound of range
    public Number from

    @info: Upper bound of range
    public Number to

    @info: Step of the values while moving the slider
    public Number step

    @info: Color of the filled part of the slider, in the HTML color notation
    public String fillColor

    @info: Current value of the slider. You can also set this property, using a value from the current range //from-to//. The slider position will be automatically updated.
    public Number value
