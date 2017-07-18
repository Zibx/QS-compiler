@info: Well, it's a Modal Window, you know
@ns: UI.Controls
define UIComponent FlexSizeComponent
    @example: String with message or question of modal window
        public ModalWindow mw1
            message: 'fire walk with me'

    @info: String with message or question of modal window
    public String message

    @example: Title of modal window
        public ModalWindow mw1
            title: DRUM

    @info: Title of modal window
    public String title

    @example: Same as message
        public ModalWindow mw1
            value: azaza

    @info: Same as message
    public String value

    @example: Show modal window if it's hide and hide if it's visible
        public ModalWindow mw1
            title: DRUM
            message: 'fire walk with me'
            Button: Toggle

        Button: Toggle2
            .click: () ->
                mw1.toggle();

    @info: Toggle event
    public Event toggle