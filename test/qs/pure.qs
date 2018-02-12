def Page main
    pure Number n1: 1
    pure public Number n2: 2
    Number n3: 3
    public Number n4: 4
    pure Button b1: {{10+n1+n2}}
        .click: ()->
            console.log(n1,n2,n3,n4, f1, f2, f3)
            f1(f2(f3()))

    Function f1: ()-> return ['f1', n1,n2,n3,n4, f1, f2, f3]
    public Function f2: ()-> return ['f2', n1,n2,n3,n4, f1, f2, f3]
    pure Function f3: ()-> return ['f3', n1,n2,n3,n4, f1, f2, f3]