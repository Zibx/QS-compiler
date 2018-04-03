@info: The `Image` object in QuokkaScript serves to represent a graphical image on a [Page](UI.Page) in a manner similar to the HTML **img** tag. The basic `Image` properties are: `source` (mandatory), `height` (optional), `width` (optional) and `stretch` (optional).


@ns: UI.Controls
def UIComponent Image

    @info: Set the image source. Must be a valid URL.
    @example: Basic `Image` example.
        Image
            source: ../../img/logo.png
    public String source

    @info: The `value` property can me used as a synonym for the `source` property.
    @example: Using value instead of source
        Image
            value: img/logo.png
        Image: img/short_syntax_demo.png
    public String value

    @info: The `stretch` property indicates the resizing method. The supported values are: `none` (default), `fill`, `uniform` and `uniformToFill`.
    @example: The default value for the `stretch` is `none`. This setting fixes image size and denies to apply further image resizing. Some clipping may occur with this setting. The image will be centered in its viewport.
        Image
            width: 100px
            height: 100px
            stretch: none
            source: my200x50picture.jpg
        /* This image will not be resized and it will be clipped by X to 100 pixels. Resulting image size will be100x50 */

    @example: The `fill` value for the `stretch` property indicates to shrink image to fill the entire area, without preserving its aspect ratio.
        Image
            width: 100px
            height: 100px
            stretch: fill
            source: my200x50picture.jpg
        /* This image will be X-shrunk to fit in 100 pixels and Y-stretched to span 100 pixels. Final image size 100x100 */

    @example: The `uniform` value for the `stretch` property indicates to stretch image preserving its aspect ratio until it exactly spans the area by at least one dimension; or shrink image preserving its aspect ratio until it fits in the area by both dimensions. The image will be centered in the area.
        Image
            width: 100px
            height: 100px
            stretch: uniform
            source: my200x50picture.jpg
        /* This image will be X-shrunk to fit in 100 pixels by width and therefore also Y-shrunk by the same ratio (0.5). Final image size 100x25 */
        Image
            width: 100px
            height: 100px
            stretch: uniform
            source: my40x50picture.jpg
        /* This image will be Y-stretched to span 100 pixels by height and therefore also X-stretched by the same ratio (2.0). Final image size 80x100 */

    @example: The `uniformToFill` value for the `stretch` property indicates to stretch image preserving its aspect ratio until it spans the area by both dimensions; or shrink image preserving its aspect ratio until it fits in the area by at least one dimension. The area must be completely filled as a result. Some clipping may occur with this method. The image will be centered in the area.
        Image
            width: 100px
            height: 100px
            stretch: uniformToFill
            source: my200x50picture.jpg
        /* This image will be Y-stretched to span 100 pixels by height and therefore also X-stretched by the same ratio (2.0). As a result, it will be clipped by X. Final image size 100x100 */
        Image
            width: 100px
            height: 100px
            stretch: uniformToFill
            source: my200x300picture.jpg
        /* This image will be X-shrunk to fit in 100 pixels by width and therefore also Y-shrunk by the same ratio (0.5). As a result, it will be clipped by Y. Final image size 100x100 */
    public String stretch
