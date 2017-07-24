@info: Geographic map provided by Yandex.

@ns: UI.Controls
def UIComponent GeoMap

    @info: Center position of the map viewport . An array of two coordinates: [latitude, longitude]
    @example: Set the coordinates of center of map
        GeoMap
            center: [56.3153305, 43.7909254]
    public Array center

    @info: The current user location. An array of two coordinates: [latitude, longitude]
    @example: Setting home
        GeoMap
            home: [56.3153305, 43.7909254]
    public Array home

    @example: Set array of pins on the map
        GeoMap
        pins: [
            {
                name: "one",
            coordinates: [56.3153305, 43.7909254]
            },
            {
            name: "hell's gates",
            coordinates: [55.788478, 37.603127]
            },
            {
            name: 123,
            coordinates: [55.764293, 37.567474]
            }
        ]
    @info: Current pin markers on the map. An **Array** containing **Array**-s of two **Number** coordinates each: [latitude, longitude]
    public Array pins

    @example: Zoom level
        GeoMap
            center: [56.3153305, 43.7909254]
            zoom: 15
    @info: Current zoom level according to the Yandex scale.
    public Number zoom

    @example: Same as center
        GeoMap
            value: [56.3153305, 43.7909254]
    @info: Synonym for //center//.
    public Array value

