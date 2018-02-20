@nested

@info: The `Format` UI control serves to display text formatted with Markdown language. The source text is rendered to HTML using [Creole markup](https://en.wikipedia.org/wiki/Creole_(markup)) engine implemented with `npm-creole` library.
@ns: UI.Controls
define UIComponent Format
    @example:
        def Page format_example
            HBox
                flexDefinition: 230px 150px 300px 225px *
                Format: """
                    **Bold font sample:**

                    __Italic font sample__: regular font sample\\
                    //today is !!September 30th!!//
                        # Header level 1
                        ## Header level 2
                    """
                Format: """
                        = H1 =
                        == H2 ==
                        === H3 ===

                        ==== H4 ====
                    """
                Format: """
                        * level 1
                        ** level 2
                        *** level 3
                    Regular-**bold** font adjusted together
                    """

    @info: HTML representation of the source text.
    public String html