@info: The base class for all components.
  Normally, you will not declare elements of this component.
@ns: Core
define QObject AbstractComponent

    @args: UIComponent child
    @info: Add a child
    public Function addChild

    @args: AbstractComponent child
    @info: Callback function, invoked when a child has just been added. Bind to this._children.on('add'...)
    public Function _onChildAdd

    @args: AbstractComponent child
    @info: Callback function, invoked when a child has just been removed. Bind to this._children.on('remove'...)
    public Function _onChildRemove

    @args: AbstractComponent child
    @info: Callback function, invoked when an "own" element has just been added. Own elements are not declared explicitly in QS, still being part of the current element due to its own architecture. Bind to this._ownComponents.on('add'...)
    public Function _onOwnComponentAdd

    @args: AbstractComponent child
    @info: Callback function, invoked when an "own" element has just been removed. Own elements are not declared explicitly in QS, still being part of the current element due to its own architecture. Bind to this._ownComponents.on('remove'...)
    public Function _onOwnComponentRemove

    @args: QObject type
    @info: Get all children that are instances of the type passed as the argument. For example, `_getAllChildren(Button)` returns an array of child Buttons
    public Function _getAllChildren

    @info: Unique identifier of the instance
    public String id