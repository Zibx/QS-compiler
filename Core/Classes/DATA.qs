@nested

@info: The `DATA` object in QuokkaScript serves to access serialized data objects. As of the current version, only JSON ((JavaScript Object Notation)[http://json.org/]) objects are supported, XML objects support is still pending. `DATA` is handy when you need to parse a complicated data structure. You get a server response, for example, ` {name: John, surname: Doe, foo: 1337, bar: 65535}`. Then you place it into `DATA user: {{request.response}}` syntactic construction and further address to the received values in a short way: `Label: USERNAME: {{user.name}}`
@example: A longer real-world usage example. The `openWeatherResponse` DATA object contains a JSON answer from OpenWeatherMap API.
    def Page dataDemo
        DATA openWeatherResponse: {"coord":{"lon":139,"lat":35},"sys":{"country":"JP","sunrise":1369769524,"sunset":1369821049},"weather":[{"id":804,"main":"clouds","description":"overcast clouds","icon":"04n"}],"main":{"temp":289.5,"humidity":89,"pressure":1013,"temp_min":287.04,"temp_max":292.04},"wind":{"speed":7.31,"deg":187.002},"rain":{"3h":0},"clouds":{"all":92},"dt":1369824698,"id":1851632,"name":"Shuzenji","cod":200}
        Header: Current weather in {{openWeatherResponse.name}}: {{openWeatherResponse.weather[0].main}}

@ns: Core
define QObject DATA