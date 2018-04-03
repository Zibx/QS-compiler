@info: The `AbstractComponent` object is the basic component upon which all other QuokkaScript components are based. `AbstractComponent` is inherited from `QObject` and serves as a parent class to `AbstractDevice`, `AbstractService`, `UIComponent`. You will hardly ever use the `AbstractComponent` itself in your ordinary work, however, this article gives you the opportunity to figure out how QuokkaScript works under the hood. `AbstractComponent` is the first component in all QuokkaScript inheritance chain that implements handling with child objects. Put this another way, the `AbstractComponent` can contain other components.

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

    public Function fire