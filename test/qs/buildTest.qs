@description: test page 1
def Page main
    opacity: {{opacity}}
    background: rgba({{s1|0}},{{s2}},{{s3}},1)

    public VBox v1:774

        Slider s1: {{s2}}
            from: 11
            to: 255
            fillColor: rgb({{s1|0}}, 0, 0)

        Label l: {{s1}}

        Slider s2: 22
            from: -255
            to: 255
            step: 1
            fillColor: rgb(0, {{s2}}, 0)

        Label: Green: {{s2}}

        Slider s3:200
            from: 0
            to: 255
            step: 5
            fillColor: rgb(0, 0, {{s3}})

        Label: Blue: {{s3}}

        Slider opacity: 66
            from: 0
            to: 1

        Label: Page opacity: {{opacity}}

        Button b1: Button1
    Timer
        enabled: true
        interval: 10
        .tick: function(){
            console.log(s1)
        }
