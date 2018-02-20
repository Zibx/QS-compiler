@nested

@info: Although belonging to UI Controls, the `Clock` component has no view. It returns date and time in different formats and also contains directories (collections of `hours` and `minutes`) that can be used as a data source for visual controls.
@example: Example of a [Wheel](UI.Controls.Wheel) control using
    def Page clocks
        Clock clock
            locale: "en-US"
            static: false
        HBox
            background: #000

            Wheel: 05
            data: {{clock.hours}}

        Wheel: 15
        data: {{clock.minutes}}


@ns: UI.Controls
define UIComponent Switch

    @info: Context-dependent collection of `Numbers` that contains hours directory. Represents 24 or 12 hours depending on the clock style.
    public Array hours

    @info: Collection of `Numbers` that contains minutes directory. Contains 60 minutes.
    public Array minutes

    @info: Current time returned by JavaScript `Date()` function.
    public String currentTime

    @info: Time format determining 24-hour or 12-hour clock style. The default value is '24'.
    public String format

    @info: Short locale identifiers defined by ISO/IEC 15897. For example, `en-US` or `en-UK`.
    public String locale