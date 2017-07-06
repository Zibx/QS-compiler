@info: Geographic map provided by Yandex.

@ns: UI.Controls
def UIComponent GeoMap

    @example: Set the coordinates of center of map
        GeoMap
            center: [56.3153305, 43.7909254]
    @info: Center position of the map viewport . An array of two coordinates: [latitude, longitude]
    @example: [55.64, 37.59]
    public Array center

    @info: The current user location. An array of two coordinates: [latitude, longitude]
    @example: [55.75, 37.65]
    public Array home

    @info: Current pin markers on the map. An array containing arrays of two coordinates each: [latitude, longitude]
    @example: [[55.64, 37.59],[55.75, 37.65]]
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
