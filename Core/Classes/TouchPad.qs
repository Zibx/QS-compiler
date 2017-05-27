@info: Touchpad abstration
@ns: Devices
def QObject TouchPad

  @info: Left click
  public Event left

  @info: Right click
  public Event right click

  @info: calibrate function
  public Function calibrate

  @info: Filter events to keep only changed
  public Boolean unique: false
