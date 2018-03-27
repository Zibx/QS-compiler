@nested
@info: The `WebClient` component in QuokkaScript is a more sophisticated and fancy child class of the [HTTPRequest](Network.HTTPRequest) module and also serves to perform interaction with servers. Being compared with its parent, the `WebClient` component has two major advantages. First, by default, it implements the reactive behaviour of the `url` property. That means, if the `url` string is changed, a new server request is instantly sent (this behaviour can be switched off after setting the `enabled` property to `false`). Secondly, the `WebClient` component automates the parsing of a server response in JSON or XML format (see the `content-type` property description). For these two reasons, we recommend you to use `WebClient` instead of the [HTTPRequest](Network.HTTPRequest) in most of your ordinary tasks.
@example: The following example demonstrate usage of both `WebClient` advantages. Choose latitude and longitude with sliders and get an instant weather report for the chosen location.
    def Page main
        Header: LAT: {{lat}}
        Slider lat: 51.5074
            from: 10
            to: 60
            step: 0.01
        Header: LON: {{lon}}
        Slider lon: 0.12
            from: 0.12
            to: 60
            step: 0.01
        WebClient get_weather
            enabled: true
            url: {{'http://api.openweathermap.org/data/2.5/weather?lat='+ lat +'&lon=' + lon + '&APPID=7221fd30a883cfd152be6cf097336582'}}
            contentType: JSON
            method: GET
        Header: {{get_weather.response.name}} - {{get_weather.response.weather[0].main}}
        Label: {{get_weather.rawResponse}}
        .firstLoaded: ()->
            get_weather.execute();


@ns: Network
define HTTPRequest WebClient

    @info: Enabling (or disabling) the reactive behaviour of the `url` property, which forces to initiate HTTP request if the `url` value was changed. The default setting is `true`.
    public Boolean enabled

    @info: This value serves to specify the estimated server response format as `JSON` or `XML`. Such being the case, `WebClient` will attempt to deserialize such objects from the server response body and place the resulting object into the `response` property.
    public String content-type

    @info: Parsed body of HTTP response.
    public QObject response

    @info: Raw body of HTTP request.
    public String rawRequest

    @info: Raw body of HTTP response.
    public String rawResponse