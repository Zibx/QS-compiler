def Page main
    Slider s0: 30
        from: 0
        to: 100
        .change: ()->
            console.log(`test it ${s0}`)
    String s: `test it ${s0>30?30:`${s0}`}`
    String t: {{`${s0}`}}