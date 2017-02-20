@description: dad
def Page main
    opacity: {{opacity}}
    background: rgba({{s1|0}},{{s2}},{{s3}},1)
    VBox

        Slider s1: 50
            from: 11
            to: 255
            fillColor: rgb({{s1|0}}, 0, 0)

        Label: Red: {{s1}}

        Slider s2: 100
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

        Slider opacity: 1
            from: 0
            to: 1

        Label: Page opacity: {{opacity}}

    Timer
        enabled: true
        interval: 10
        .tick: function(){
            var d = new Date()/100;

            for(var i = 0; i<30; i++)
                p.line([s1*i*36*Math.cos(d)+500,s2*i*73*Math.cos(d/2)+400],[s3*i*36*Math.sin(d)+500,i*73*Math.sin(d/2)+500],'rgb('+[
                    (Math.sin(i*d)*120)|0+121,
                    (Math.sin(i*d/2)*120)|0+121,
                    (Math.sin(i*d/7)*120)|0+121
                ]+')');

            for(var j = 0; j<30; j++)
                p.line([0,j*36],[1920,j*36]);
        }
