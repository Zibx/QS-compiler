@info: Geographic map provided by Yandex.

@ns: UI.Controls
def UIComponent GeoMap

    @info: Center position of the map viewport . An array of two coordinates: [latitude, longitude]
    @example: [55.64, 37.59]
    public Array center

    @info: The current user location. An array of two coordinates: [latitude, longitude]
    @example: [55.75, 37.65]
    public Array home

    @info: Current pin markers on the map. An array containing arrays of two coordinates each: [latitude, longitude]
    @example: [[55.64, 37.59],[55.75, 37.65]]
    public Array pins

    @info: Current zoom level according to the Yandex scale.
    public Number zoom

    @info: Synonym for //center//.
    public Array value
