@info: Geographic map provided by Yandex.

@ns: UI.Controls
def UIComponent GeoMap

    @info: Center position of the map viewport . An **Array** of two **Number** coordinates
    @example: [55.64, 37.59]
    public Array center

    @info: The current user location. An **Array** of two **Number** coordinates: [latitude, longitude]
    @example: [55.64, 37.59]
    public Array home

    @example: [[55.64, 37.59],[55.75, 37.65]]
    @info: Current pin markers on the map. An **Array** containing **Array**-s of two **Number** coordinates each: [latitude, longitude]
    public Array pins

    @info: Current zoom level **Number**. The actual zoom defined by this number depends on the //type// of the map.
    public Number zoom

    @info: Synonym for //center//.
    public Array value

