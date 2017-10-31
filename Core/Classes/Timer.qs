@info: Timer capable of measuring time intervals, which are marked by firing the Timer's //.tick// event.
@ns: Core
def QObject Timer
    @info: Total ticks counter
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
