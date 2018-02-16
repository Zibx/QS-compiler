@nested
@system: true

@info: The `ContainerComponent` serves as a template engine to visualize a collection. It has two main properties: `itemSource` and `itemTemplate`.
@example:
    def UIComponent Example
        background: #004
        public String name
        public String surname
        public Number age
        Header.small: {{name}} {{surname}} {{s1}}
        public Slider s1: {{age}}
            from: 0
            to: 120
    def Page ContainerComponentExample
        Header.medium h:
        ContainerComponent
            itemTemplate: Example
            itemSource: [
                {name: 'John', surname: 'Brown', age: 28},
                {name: 'Margaret', surname: 'Richardson', age: 35},
                {name: 'Lisa', surname: 'Smith', age: 18}
            ]
        .itemClick: (data)->
        h = 'Selected item Name = '+ data.name


@ns: UI.Controls
def UIComponent ContainerComponent
    @info: The `itemSource` property serves to receive a [Collection](Core.Structures.Collection) from any data source (external service API or database).
    public Array itemSource

    @info: The `itemTemplate` object defines a template to render each item from the [Collection](Core.Structures.Collection) in the `itemSource` property.
    public QObject itemTemplate

    @info: The `itemClick` event is fired when an element of the `itemSource` collection is clicked.
    public Event itemClick

    @info: The colour of the selected element in the `itemSource` collection in the usual HTML/CSS format.
    public String selectionColor

    @info: The index of the selected element in the `itemSource` collection.
    public Number selectedIndex

    @info: The number of children in the `itemSource` collection.
    public Number childrenLength

    @info: The selected element of the `itemSource` collection.
    public Variant selectedItem

    @info: This Boolean attribute indicates that the elements from the `itemSource` collection can be selected by user.
    public Boolean selectable