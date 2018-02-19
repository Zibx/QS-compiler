@nested

@info: The `Input` control allows to create a highly customizable input controls instead of a screen keyboard. For example, a date picker or a nested drop-down country/region/city/street/address list.
@example: An example of Android-like date wheel picker.
def UIComponent DateWheels
    public Number year: {{w3}}
    public String month: {{w2}}
    public Number day: {{w1}}

    Calendar cal
        day: {{day}}
        month: {{month}}
        year: {{year}}
        minYear: 1970
        maxYear: 2070

    HBox
        flexDefinition: 225px 550px 300px
        Wheel w1
            value: {{day}}
            data: {{cal.days}}
            Label: Дата
        Wheel w2
            value: {{month}}
            data: {{cal.months}}
        Wheel w3
            value: {{year}}
            data: {{cal.years}}

def Page main
    Input i0: {{this.day}}-{{this.month}}-{{this.year}}
        label: Date
        picker: DateWheels
        day: 19
        month: September
        year: 2019


@ns: UI.Controls
define UIComponent Input

    @info: The input field label caption.
    public String label

    @info: The picker object.
    @example: A simple binary number picker created using the [Switch](UI.Controls.Switch) control. Apart from true/false values, the [Switch](UI.Controls.Switch) can also return a binary number.
        def UIComponent Digital
          HBox
            padding: 20px
            height: 110px
            public String label: Pick a number
            public Switch v1
            public Switch v2
            public Switch v3
        def Page CustomInputs
            Input: {{this.v1+this.v2*2+this.v3*4}}
                label: Number picker
                picker: Digital
                v1: 0
                v2: 0
                v3: 1
    public QObject picker