@info: The `Timer` component is a time-based job scheduler that primarily serves to automate repeating actions or to perform a delayed execution of a code snippet. `Timer` measures time intervals that are marked by firing the Timer's `.tick` event.
@example: The basic syntax of `Timer` usage is like that:
    Timer t
        enabled: true
        interval: 1000
        .tick: ()->
            // do something

@ns: Core
define AbstractComponent Timer

    @info: Total ticks counter
    @example: A more visual example that demonstrates enabling and disabling `Timer` that counts all `.tick` events.
        def Page main
            Switch enabledSwitch
                label: Enabled
            Timer t1
                interval: 100
                enabled: {{enabledSwitch}}
                .tick: ()->{
                    console.log("Ticks!",t1);
                    t1.enabled();
                }
            Header: Timer ticks {{t1}} times
    public Number counter: 0

    @info: Switch the timer `enabled` flag to //true// and start firing `.tick` event
    public Function start

    @info: Switch the timer `enabled` flag to //false// and stop firing `.tick` event
    public Function stop

    @info: Flag defining whether this timer is enabled (started).
    public Boolean enabled: false

    @info: The timer interval in milliseconds
    public Number interval

    @arg: time
      Current time
    @info: Timer reactive property that changes its value to //true// and then immediately to //false// upon each `.tick` event
    public Event tick
