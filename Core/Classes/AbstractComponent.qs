@info: The base class for all components. Normally, you will not declare elements of this component.
@ns: Core
define QObject AbstractComponent

    @args: UIComponent child
    @info: method that is called when child is added
    public Function addChild

    @info: Bind to this._children.on('add'...)
    public Function _onChildAdd

    @info: Bind to this._children.on('remove'...)
    public Function _onChildRemove

    @info: Bind to this._ownComponents.on('add'...)
    public Function _onOwnComponentAdd

    @info: Bind to this._ownComponents.on('remove'...)
    public Function _onOwnComponentRemove

    @info: get all children that parent is matched passed as argument class constructor
    public Function _getAllChildren

    @info: unique identifier of instance
    public String id