@info: SIP client abstration
  Suits for making calls

@ns: Devices
def QObject SIP

  @info: Start call
  public Function call


  @info: Use emulated device
  public Boolean shim: false

  @info: Connection to server established flag
  public Boolean ready: false

  @info: call destination. Check out your SIP server documentation for correct format
  public String destination

  @info: call status
  public String status

  @info: SIP server
  public String url

  @info: hangup
  public Function end