@nested
@info: The `HTTPRequest` component in QuokkaScript serves to perform interaction with servers. You can retrieve data from a URL without having to do a full [Page](UI.Page) refresh. This enables a Web page to update just part of a page without disrupting what the user is doing. The `HTTPRequest` component is also a parent for the [WebClient](Network.WebClient) module. We recommend you to use [WebClient](Network.WebClient) instead of `HTTPRequest` for the majority of your ordinary tasks because it provides more advantages (for example, an automated parsing of a server response in JSON format). **Attention:** as of the current version, `HTTPRequest` can be used to send or retrieve only JSON objects, XML support is pending.


@example: A very basic `HTTPRequest` to demonstrate how to query a website on button press.
    def Page main
        HttpRequest get_weather: http://api.openweathermap.org/data/2.5/weather?lat=22.1734&lon=15.3076&APPID=7221fd30a883cfd152be6cf097336582
        Button: 'Get weather!'
            .click: ()->
                get_weather.execute();

@ns: Network
define RunAtServerComponent HTTPRequest

    @info: Set the HTTP Request url.
    @example: A little more advanced version of the previous code sample with a focus on the `url` property.
        def Page main
            public Number lat: 22.1734
            public Number lon: 15.3076
            public String api_key: 7221fd30a883cfd152be6cf097336582
            HttpRequest get_weather
                url: {{'http://api.openweathermap.org/data/2.5/weather?lat='+ lat+'&lon='+lon+'&APPID='+ api_key}}
            Button: 'Get wether!'
                .click: ()->
                    get_weather.execute();

    @info: Set the HTTP Request query string. The serialized object in JSON format is expected here.
    @example: A little more advanced version of the previous code sample with a focus on the `queryString` property.
        def Page main
            public String api_key: 7221fd30a883cfd152be6cf097336582
            HttpRequest get_weather
                url: 'http://api.openweathermap.org/data/2.5/weather'
                queryString: {
                    lat: 22.1734,
                    lon: 15.3076,
                    APPID: {{api_key}}
                }
            Button: 'Get wether!'
                .click: ()->
                    get_weather.execute();
    public String queryString


    @info: Set the HTTP Request method. Can be `GET`, `POST`, `INSERT` or `DELETE`.
    @example: A variation of the previous code with the `get` setting of the `method` property specified. Does exactly the same as the previous code snippet.
        def Page main
            HttpRequest get_weather
                url: 'http://api.openweathermap.org/data/2.5/weather'
                queryString: {
                    lat: 22.1734,
                    lon: 15.3076,
                    APPID: 7221fd30a883cfd152be6cf097336582
                }
                method: GET
            Button: 'Get wether!'
                .click: ()->
                    get_weather.execute();
    public String method


    @info: Set the HTTP Request headers. The serialized object in JSON format is expected here.
    @example: A variation of the previous code snipped with added user-agent and a Cookies value.
        def Page main
            HttpRequest get_weather
                url: 'http://api.openweathermap.org/data/2.5/weather'
                queryString: {
                    lat: 22.1734,
                    lon: 15.3076,
                    APPID: 7221fd30a883cfd152be6cf097336582
                }
                method: GET
                headers: {
                    'User-Agent': 'Quokka Browser',
                    Cookies: '541a602f6803844376e903d27f355ddfc064f7c2'
                }
            Button: 'Get wether!'
                .click: ()->
                    get_weather.execute();
    public String headers

    @info: Set the HTTP Request body. The serialized object in JSON format is expected here.
    public String body

    @info: Execute the HTTP request.
    @example: The HTTP request will be executed when the main [Page](UI.Page) is loaded.
        def Page main
            HttpRequest get_weather: http://api.openweathermap.org/data/2.5/weather?lat=22.1734&lon=15.3076
            .firstLoaded: ()->{
                get_weather.execute();
        }
    public Function execute

    @info: Abort the current HTTP request (if present).
    @example: The HTTP request will be executed when the main [Page](UI.Page) is loaded. Click on **Abort request** button can instantly interrupt its progress.
        def Page main
            HttpRequest get_weather: http://api.openweathermap.org/data/2.5/weather?lat=22.1734&lon=15.3076
            .firstLoaded: ()->{
                get_weather.execute();
        }
            Button: 'Abort request'
                .click: ()->
                    get_weather.abort();
    public Function abort