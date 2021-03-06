@nested

@info: A generic inline container for phrasing content, which does not inherently represent anything. It can be used to group elements for styling purposes.
@example:
    Label: TextColor
    TextBox t: {{store.globalResources.textColor}}
    Border
        height: 100px
        width: 100px
        background: {{t}}
    Button: daw
        .click:()->
            store.globalResources.textColor = t

@ns: UI.Controls
def UIComponent Border
    @info: The `margin` property works in a similar way with the CSS one. It sets the margin area on all four sides of a `Border` element.
    @example:
        Border
            margin: 40px 20px
            background: rgba(255,255,255, 0.5)
            IFrame frame: 'https://google.com:443'
    public String margin

    public String borderRadius