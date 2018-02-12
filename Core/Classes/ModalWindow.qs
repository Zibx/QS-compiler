@info: Modal window displaying a caption (a title) and a message (typically, a question). Users must finish interaction with the modal window before they can return to the parent application (window).
@ns: UI.Controls
define UIComponent ModalWindow
    @example: A simple modal window with a message and title
        public ModalWindow mw1
            title: 'Attention'
            message: 'Please prepare your ID. It will be requested on the next step'

    @info: The message or question that the modal window displays
    public String message

    @example: A simple modal window with a message and title
        public ModalWindow mw1
            title: 'Attention'
            message: 'Please prepare your ID. It will be requested on the next step'

    @info: Title (caption) of the modal window
    public String title

    @info: Synonym for `message`
    public String value

    @example: Showing the modal window if it is hidden and hiding if it is visible
        public ModalWindow mw1
            title: 'Attention'
            message: 'Please prepare your ID. It will be requested on the next step'
            Button: Toggle
        Button: Toggle2
            .click: () ->
                mw1.toggle();

    @info: Toggle visibility of a modal window
    public Function toggle

    @info: Hide modal dialog
    public Function hide
    @info: Show modal dialog
    public Function show

