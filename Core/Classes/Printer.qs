@info: The printer device

@ns: Devices
def QObject Printer

  @info: Perform the printing using the currently set `template` property and the incoming `cfg` parameters.
  @arg: Object cfg
    Object containing parameter values to be substituted in the `template` and printed out.
    This parameter is a set of //key:value// pairs. Each key is a parameter name that should be present in the `template` with the syntax of //{key}//.
    Before printing, each //{key}// expression in the `template` is replaced with the corresponding value found in `cfg` for this key.
    If the value for a certain key has not been found, this //{key}// expression will be printed as is.
    If any of the //key:value// pairs supplied in `cfg` does not have a corresponding //{key}// expression in the `template`, the supplied value will not be printed.
  public Function print

  @info: Update current value of paperLength.
  public Function getPaper

  @info: String template that will be used during the next printing operation (see `print`). Templates may specify parameter placeholders in the form of //{param_name}// expressions.
    Parameter values passed to the next print operation are substituted in place of these placeholders.
    A template may have no line break in the end: the `print` operation automatically appends one during the printing.
  public String template

  @info: Leght of papeer (cm) available before virtual paper end
  public String paperLength