def Page main
    Slider s0: 30
        from: 0
        to: 100
        .change: ()->
            console.log(`test it ${s0}`)
    String s: `test it ${s0}`
