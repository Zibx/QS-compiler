@info: # Cardreader and Carddispenser device
  Device is build from 4 parts:
  - outer part that Human interacts with
  - tract - part where we can read card info
  - trash - part where we put cards that shouldn't be returned
  - new cards stack - tower with new cards that can be dispensed to Human through tract
@ns: Devices
def QObject CardReader
  public Function cross

  @info: Read magnetic tracks from card in the tract
  public Function read

  @info: Move card from tract to trash container
  public Function trash

  @info: Dispense a new card to the devices tract
  public Function newCard

  @info: Dispense card from tract
  public Function dispense


  @info: Use emulated device
  public Boolean shim: false

  @info: Switch device to active state
  public Boolean enabled: false

  @info: First track of card
  public String Track1

  @info: Second track of card
  public String Track2

  @info: Third track of card
  public String Track3
