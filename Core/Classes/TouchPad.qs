@info: Touchpad abstration
@ns: Devices
def QObject TouchPad

  @info: Left click
  public Event left

  @info: Right click
  public Event right

  @info: Event that fires on each change of pointer position
  public Event move

  @info: calibrate function
  public Function calibrate

  @info: Filter events to keep only changed
  public Boolean unique: false
