@info: Common abstract base component for [HBox](UI.HBox) and [VBox](UI.VBox). You should never declare a FlexSizeComponent directly - create an [HBox](UI.HBox) or [VBox](UI.VBox) instead.
    FlexSizeComponent contains a basic logic that allows you to define the width of each nested element of your [HBox](UI.HBox) or the height of each nested element of your [VBox](UI.VBox) in a single property.
    These characteristics are specified by the only `flexDefinition` property of FlexSizeComponent.
    Extends UIComponent in the UI.Controls namespace.
@ns: UI.Controls
define UIComponent FlexSizeComponent
