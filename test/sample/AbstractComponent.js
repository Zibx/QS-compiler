var ObservableSequence = require('observable-sequence');
var DQIndex = require('z-lib-structure-dqIndex');

var QObject = require('./QObject');

/** @class */
var AbstractComponent = QObject.extend('Core', 'AbstractComponent',
    {
        addChild: function (component) {
            this._children.push(component);
            return this;
        },

        /**
         * Bind to this._children.on('add'...)
         *
         * @param {AbstractComponent} child
         * @returns {void}
         */
        _onChildAdd: function (child) {
            child.parent = this;
        },

        /**
         * Bind to this._children.on('remove'...)
         *
         * @param {AbstractComponent} child
         * @returns {void}
         */
        _onChildRemove: function (child) {
            child.parent = null;
        },

        /**
         * Bind to this._ownComponents.on('add'...)
         *
         * @param {AbstractComponent} child
         * @returns {void}
         */
        _onOwnComponentAdd: function (child) {
            child.parent = this;
        },

        /**
         * Bind to this._ownComponents.on('remove'...)
         *
         * @param {AbstractComponent} child
         * @returns {void}
         */
        _onOwnComponentRemove: function (child) {
            child.parent = null;
            //should not be called
        },

        _prop: {
            id: null
        }
    },
    /**
     * @constructs AbstractComponent
     */
    function () {

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
    });

module.exports = AbstractComponent;