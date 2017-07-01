@info:
  # The Card reader and Card dispenser device
  The device consists of four parts:
  - The external interface, which the user interacts with
  - The **tract** - the magnetic stripe tracks reader, as well as the dispensing tract
  - The **reject tray**
  - A **stack** of new cards to be dispensed through the tract
@ns: Devices
def QObject CardReader

  @info ...To be described
  public Function cross

  @info: Grip a card and move it into the tract
  public Function entry

  @info: Read magnetic stripe tracks of card in the tract
  public Function read

  @info: Eject a card from the tract and release it
  public Function eject

  @info: Move a card from the tract to the reject tray
  public Function trash

  @info: Prepare a new card to be dispensed though the tract
  public Function newCard

  @info: Dispense a card from tract
  public Function dispense

  @info: Device emulation mode flag
  public Boolean shim: false

  @info: Switch device on
  public Boolean enabled: false

  @info: Content of the Track 1
  public String Track1

  @info: Content of the Track 2
  public String Track2

  @info: Content of the Track 3
  public String Track3

  @info: Status of the device in a readable form
  public String status

  @info: Status code of the device
  public String statusCode
