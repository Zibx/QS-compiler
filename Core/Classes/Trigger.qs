@info: `Trigger` allows to create and handle customized events. In particular, to run a specific code on any unusual condition. For example, open a menu when the proximity sensor detects the approach of the user.
@example: `Trigger` usage example
    Proximity proximitySensor
    Trigger near: {{proximitySensor.distance<50}}
        once: true
        .trigger: () ->
NavigationManager.navigate('menu')
@ns: Core
def QObject Trigger
@info: Trigger `value` contains the reactive subscription to be watched and triggered.
    public String value
@info: The binary attribute `once` determines the Trigger working mode (single-time vs multi-time activation). Default value is `undefined`, i.e. Trigger activates multiple times.
    public Boolean once
@info: The binary attribute `fired` demonstrates if the Trigger was activated at least once.
    public Boolean fired
@info: Event to be triggered on changing the 'value' property of Trigger object
@arg: String value
    public Event trigger