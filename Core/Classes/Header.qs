@info: The `Header` component is inherited from the [Label](UI.Controls.Label) and behaves similarly to the `H1` tag in HTML markup. Can contain text or an [Image](UI.Controls.Image). The default position of `Header` is to the right of the preceding visual element.

@example: The most common usage is declaring a simple text header:
    Header: I am a simple text header!

@example: Header with a graphic logo.
    def Page main
        header:
            Image: 'img/logo.png'
                width: '320px'
                height: '100px'
                margin: '0 0 0 73px'
                stretch: 'uniform'

@ns: UI.Controls
def Label Header

    @info The `anchor` property is the `id` of the generated HTML element.
    public String anchor

    @info The `align` property describes how inline content of the `Header` is aligned in its parent block element.
    public String align

    @info The `size` property is used to customize the headers size. The default value is `big`. Can be changed to `small` or `medium`.
    public String size
