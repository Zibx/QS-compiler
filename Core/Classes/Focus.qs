@nested

@info: Although belonging to the UI Controls subtree, the `Focus` component has no view. It serves to avoid the appearance of the screen keyboard in that case when the first element of the [Page](UI.Page) requires text input, for example, the [TextBox](UI.Controls.TextBox) control.

@example: "As the `Focus` control stands before the `TextBox` field in this sample, the on-screen keyboard doesn't appear when the `Page` is loaded."
    def Page FocusAndTextBox
        header:
            Header: {{t1}} {{t1.value}}
        Focus
        TextBox t1
            label: Please, input your text here
            layout: en

@example: In the opposite case, the on-screen keyboard will appear because the `TextBox` control gets focus automatically when the `Page` has been loaded.
    def Page FocusAndTextBox
        header:
            Header: {{t1}} {{t1.value}}
        TextBox t1
            label: Please, input your text here
            layout: en

@ns: UI.Controls
define UIComponent Focus
