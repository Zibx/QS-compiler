@ns: Core
def QObject ObservableSequence
    public Function push
    public Function on

@ns: Core
def QObject DQIndex
    public Function on

@ns: Core
def QObject AbstractComponent
    public String id
    public ObservableSequence _children
    public ObservableSequence _ownComponents

    Function addChild: function(component){
        _children.push(component);
        return this;
    }
    @description: "Bind to this._children.on('add'...)"
    Function _onChildAdd: function (AbstractComponent child) {
        child.parent = this;
    }

    @description: "Bind to this._children.on('remove'...)"
    Function _onChildRemove: function (AbstractComponent child) {
        child.parent = null;
    }

    @description: "Bind to this._ownComponents.on('add'...)"
    Function _onOwnComponentAdd: function (AbstractComponent child) {
        child.parent = this;
    }

    @description: "Bind to this._ownComponents.on('remove'...)"
    Function _onOwnComponentRemove: function (AbstractComponent child) {
        child.parent = null;
    }
    Function ctor: function(){
        /**
         * Own Components
         *
         * @type {AbstractComponent[]}
         * @private
         */
        this._ownComponents = new ObservableSequence(new DQIndex('id'));
        this._ownComponents.on('add', this._onOwnComponentAdd.bind(this));
        this._ownComponents.on('remove', this._onOwnComponentRemove.bind(this));


        /**
         * Child Components
         *
         * @type {AbstractComponent[]}
         * @private
         */
        this._children = new ObservableSequence(new DQIndex('id'));
        this._children.on('add', this._onChildAdd.bind(this));
        this._children.on('remove', this._onChildRemove.bind(this));

        this.parent = null;
    }

