 define UIComponent, mumu, chuchu Slider
   @namespace: Quokka
   @description: Slider visual component
   public Event end: {{to==value}} // event would be fired when value == to
/*
   public Event 2end: {{to==value}} // event would be fired when value == to
*/

   public Event leaveEnd
    @description: fires when the silder leaves endpoint

   .endEvt: (a,b)->
    var x;
  	states.goto('e n d')
  	x = 2;

   Event: {{to!==value}}
     .on: ()-> states.goto('somewhere')
     ""''

   StateMachine states
     """st"art"""
/* */somewhere
     end
       .leave: ()->
         that.fire('leaveEnd')

   String url: http://ya.ru
   public Number from: 0
     @description: Minimum slider value

   public Number to: 100
     @description: Maximum slider value

   Number current as public value: 0
     @description: current position of the slider
     set: (val)->
        if(val < from || val > to)
            cancel(Notice('Out of range'))

   Number delta: {{to-from}}

   Circle
     left: {{
        (that.width-this.width)/delta * // width per unit
        (current-from)/delta // units in value
        + this.width/2 //
        }}%
     top: 0
     origin
       x: 50%
       y: 50%
     free: true // TODO поспорить о синтаксисе -ния компонента из потока рендеринга

   public Function randomize
     @description: function sets slider to the random position
     value: function(from, to){
        that.value = Math.random()*(to-from)+from;
     }


def OtherSlider: UIComponent