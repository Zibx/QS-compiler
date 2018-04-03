@nested

@info: The `PhoneTextBox` controls represents a single-line text field adjusted for easier phone number input. In contrast to the [PhoneBox](UI.Controls.PhoneBox) control, `PhoneTextBox` uses the human-readable phone format, for example, +7(916)212-85-06. Meanwhile, the [PhoneTextBox](UI.Controls.PhoneBox) provides the pure MSISDN format; the same number will be formatted this way: +79162128506.
@example: `PhoneTextBox` vs [PhoneBox](UI.Controls.PhoneBox)
    def Page phoneBoxDemo
        header:
            Header: {{phoneTextBox1.clearValue}}

        Focus
        PhoneBox phoneBox1          // +7##########
            label: PhoneBox
            layout: number

        PhoneTextBox phoneTextBox1
            label: PhoneTextBox     // +7(###)###-##-##
            layout: number

        Button next: Next field
            disabled: false

@ns: UI.Controls
def TextBox PhoneBox
