@info: """Graphical image.
    Attention: as of the current version, to display an image you must always specify the absolute width and height of the image area in pixels, for example:
    <code javascript>
    Image
        width: 100px
        height: 100px
        ...
    </code>"""


@ns: UI.Controls
def UIComponent Image

    @info: Image source, **String**. Must be a valid URL
    public String source

    @info: Synonym for //source//
    public String value

    @info: Image resizing method, **String**.
        Supported values:
            //none//\\
            Do not apply image resizing. Some clipping may occur with this method. The image will be centered in the area.\\
            __Example:__\\
            <code javascript>
            Image
                width: 100px
                height: 100px
                stretch: none
                source: my200x50picture.jpg

            /* This image will not be resized and it will be clipped by X to 100 pixels. Final image size 100x50
            */
            </code>

            //fill//\\
            Stretch or shrink image to fill the entire area, without preserving its aspect ratio.\\
            __Example:__\\
            <code javascript>
            Image
                width: 100px
                height: 100px
                stretch: fill
                source: my200x50picture.jpg

            /* This image will be X-shrunk to fit in 100 pixels and Y-stretched to span 100 pixels. Final image size 100x100
            */
            </code>

            //uniform//\\
            Stretch image preserving its aspect ratio until it exactly spans the area by at least one dimension; or shrink image preserving its aspect ratio until it fits in the area by both dimensions. The image will be centered in the area.\\
            __Examples:__\\
            <code javascript>
            Image
                width: 100px
                height: 100px
                stretch: uniform
                source: my200x50picture.jpg
            /* This image will be X-shrunk to fit in 100 pixels by width and therefore also Y-shrunk by the same ratio (0.5). Final image size 100x25
            */
            </code>

            <code javascript>
            Image
                width: 100px
                height: 100px
                stretch: uniform
                source: my40x50picture.jpg
            /* This image will be Y-stretched to span 100 pixels by height and therefore also X-stretched by the same ratio (2.0). Final image size 80x100
            */
            </code>

            //uniformToFill//\\
            Stretch image preserving its aspect ratio until it spans the area by both dimensions; or shrink image preserving its aspect ratio until it fits in the area by at least one dimension. The area must be completely filled as a result. Some 								clipping may occur with this method. The image will be centered in the area.\\
            __Examples:__\\

            <code javascript>
            Image
                width: 100px
                height: 100px
                stretch: uniformToFill
                source: my200x50picture.jpg
            /* This image will be Y-stretched to span 100 pixels by height and therefore also X-stretched by the same ratio (2.0). As a result, it will be clipped by X. Final image size 100x100
            */
            </code>

            <code javascript>
            Image
                width: 100px
                height: 100px
                stretch: uniformToFill
                source: my200x300picture.jpg
            /* This image will be X-shrunk to fit in 100 pixels by width and therefore also Y-shrunk by the same ratio (0.5). As a result, it will be clipped by Y. Final image size 100x100
            */
            </code>

            The default value for //stretch// is //none//.
    public String stretch

