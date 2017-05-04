@ns: UI.Controls
def UIComponent Slider

    @info: Lower bound of range
    public Number from

    @info: Upper bound of range
    public Number to

    @info: 
    public Number step

    @info: Color of the filled part
    public String fillColor

    @info: Current value of slider. You can also set this property, using a value from the current range //from-to//. The slider position will be automatically updated.
    public Number value