@nested

@info: The `PhoneBox` controls represents a single-line text field adjusted for easier phone number input. In contrast to the [PhoneTextBox](UI.Controls.PhoneTextBox) control, `PhoneBox` uses the pure MSISDN format, for example, +79162128506. Meanwhile, the [PhoneTextBox](UI.Controls.PhoneTextBox) provides human-readable phone format; the same number will be formatted this way: +7(916)212-85-06.
@example: `PhoneBox` vs [PhoneBox](UI.Controls.PhoneBox)
    def Page phoneBoxDemo
        header:
Header: {{phoneBox1.clearValue}}

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
