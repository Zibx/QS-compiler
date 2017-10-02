@info: "Well, it's a Modal Window, you know"
@ns: UI.Controls
define UIComponent ModalWindow
    @example: Set the message or question of the modal window
        public ModalWindow mw1
            message: 'fire walk with me'

    @info: String with message or question of the modal window
    public String message

    @example: Set the title of the modal window
        public ModalWindow mw1
            title: DRUM

    @info: Title of the modal window
    public String title

    @example: Set the message or question of the modal window
        public ModalWindow mw1
            value: Maybe not

    @info: Same as message
    public String value

    @example: "Show modal window if it's hide and hide if it's visible"
        public ModalWindow mw1
            title: DRUM
            message: 'fire walk with me'
            Button: Toggle

        Button: Toggle2
            .click: () ->
                mw1.toggle();

    @info: Toggle function
    public Function toggle

    @info: Hide modal dialog
    public Function hide
    @info: Show modal dialog
    public Function show