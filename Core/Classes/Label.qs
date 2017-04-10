@ns: UI.Controls
def UIComponent Label
    public String value
    public String color

@ns: UI.Controls
def UIComponent CheckBox
    public Boolean value: false

@ns: Devices
def Class BillValidator
    public Boolean enabled: false
    public Boolean ready: false
    public String lastBill