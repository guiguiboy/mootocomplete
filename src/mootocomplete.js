/**
 * v0.1
 * Mootocomplete
 * Simple autocomplete lib for mootools
 */

var Mootocomplete = new Class({

    Implements: [Events, Options],

    /**
     * Available options to configure Mootocomplete
     *  - dataSource : MootocompleteDatasource* (how to create Interface in Mootools ??)
     *  - itemClass :
     *  - imgPath : path to imgs (assets ?)
     *  - zIndex ???
     *  - displaySpinner: displays the spinner at the right of the input
     */
    options: {

        mootocompleteClass: 'mootocomplete-container',
        itemClass: null,
        itemSelectCallback: function(){},
        maxItems: 10,
        displayEmptyItem: true,
        emptyText: '(No value)',
        emptyItemClass: 'mootocomplete-empty-value',
        imgPath: '/mootocomplete/imgs/',
        displaySpinner: true,
        minCharacters: 3,
        limit: 10,
        noResultText: 'No results for this search',
        ajaxRequestHandlerClass: 'MootocompleteAjaxRequest', //Or any MootocompleteAjaxRequest subtype
        spinnerGif: 'spinner.gif' //inside the imgPath
    },

    /**
     * Element
     */
    field: null,

    /**
     * url for ajax requests
     */
    url: null,

    /**
     * boolean
     */
    isActive: true,

    /**
     * Element
     * ul Container
     */
    ulContainer: null,

    /**
     * Element
     * Div Container
     */
    divContainer: null,

    /**
     * Request Handler
     */
    requestHandler: null,

    /**
     * Constructor
     */
    initialize: function(field, url, options){
        this.field = field;
        this.url   = url;
        this.setOptions(options);
        this.addListeners();
        this.initializeElements();
        this.initializeAjaxRequestHandler();
    },

    /**
     * Inits component
     */
    initializeElements: function()
    {
        this.divContainer = new Element('div', {
            class: this.options.mootocompleteClass
        });
        this.ulContainer = new Element('ul');
        this.ulContainer.inject(this.divContainer);
        this.divContainer.inject(this.field, 'after');
        this.divContainer.hide();
    },

    /**
     * Inits the Ajax request handler class
     */
    initializeAjaxRequestHandler: function()
    {
        this.requestHandler = new window[this.options.ajaxRequestHandlerClass](this.url, {
            onSuccess: this.displayAutocomplete.bind(this)
        });
    },

    /**
     * Stops the autocomplete
     */
    stop: function()
    {
        this.isActive = false;
    },

    /**
     * Starts the autocomplete
     */
    start: function()
    {
        this.isActive = true;
    },

    /**
     * Positionne les listeners
     */
    addListeners: function()
    {
        $(this.field).addEvent('keyup', this.processAutocomplete.bind(this));
    },

    /**
     * Process l'affichage de l'autocomplete
     */
    processAutocomplete: function()
    {
        if (!this.isActive)
            return;

        this.displaySpinnerOnInput();
        this.processRequest();
    },

    /**
     * Displays the autocomplete based on JSON data
     *
     * @param json
     */
    displayAutocomplete: function(json)
    {
        var values = JSON.decode(json);

        if (values.length == 0)
            this.displayEmptyAutocomplete();
        else
            this.displayFilledAutocomplete(values);
    },

    /**
     * Affiche un autocomplete vide
     */
    displayEmptyAutocomplete: function()
    {
        this.ulContainer.empty();

        var li = new Element('li', {
            text: this.options.noResultText,
            class: 'mootocomplete-li'
        });
        this.ulContainer.adopt(li);

        this.hideSpinnerOnInput();

        this.divContainer.show();
    },

    /**
     * Affiche un autocomplete remplit
     */
    displayFilledAutocomplete: function(values)
    {
        this.ulContainer.empty();

        //get a spinner inside the text element for more rock !

        if (this.options.displayEmptyItem) {
            var li = new Element('li', {
                text: this.options.emptyText,
                class: this.options.emptyItemClass
            });
            li.addEvent('click', this.processEmptyItemSelected.bind(this));
            this.ulContainer.adopt(li);
        }


        values.forEach(function (text, index) {
            var li = new Element('li', {
                text: text,
                class: 'mootocomplete-li'
            });
            this.configureLi(li);
            this.ulContainer.adopt(li);
        }.bind(this));

        this.hideSpinnerOnInput();

        this.divContainer.show();
    },

    /**
     * Event fired when the empty item has been selected on the list
     */
    processEmptyItemSelected: function()
    {
        this.field.set('value', '');
        this.options.itemSelectCallback(null);
        this.hideAutocomplete();
    },

    /**
     * Displays the spinner at the very right of the input
     */
    displaySpinnerOnInput: function()
    {
        if (!this.options.displaySpinner)
            return;
        this.field.set('style', 'background:#FFFFFF url(' + this.options.imgPath + '/' + this.options.spinnerGif +') no-repeat 4px 4px; padding:4px 4px 4px 22px; height:18px');
    },

    /**
     * Hides spinner when it is printed
     */
    hideSpinnerOnInput: function()
    {
        if (!this.options.displaySpinner)
            return;
        this.field.set('style', '');
    },

    /**
     * Configure li Element of the autocomplete list
     *
     * @param li
     */
    configureLi: function(li)
    {
        li.addEvent('click', this.processItemSelected.bind(this));
    },

    /**
     * Fires when an item was selected in the list
     */
    processItemSelected: function(ev)
    {
        this.field.set('value', ev.target.innerHTML);
        this.options.itemSelectCallback(ev.target.innerHTML);
        this.hideAutocomplete();
    },

    /**
     * Hides autocomplete
     */
    hideAutocomplete: function()
    {
        this.divContainer.empty();
        this.divContainer.hide();
    },

    /**
     * Processes Ajax request in order to retrieve the data
     */
    processRequest: function()
    {
        this.requestHandler.sendRequest({
            input: this.field.value,
            limit: this.options.limit
        });
    }

});


/**
 * MootoCompleteAjaxRequest
 * Class to handle such Ajax Requests for the autocompleter to work.
 */
var MootocompleteAjaxRequest = new Class({

    url: null,

    onSuccess: function() {},

    onComplete: function() {},

    onFailure: function() {},

    /**
     * Constructor
     *
     * @param url
     * @param options
     */
    initialize: function(url, options) {
        this.url = url;
        this.onSuccess  = options.onSuccess;
        this.onComplete = options.onComplete;
        this.onFailure  = options.onFailure;
    },

    /**
     * Sends the request
     *
     * @param data
     */
    sendRequest: function(data) {
        new Request({
            url: this.url,
            method: 'POST',
            data: data,
            onSuccess: this.onSuccess,
            onComplete: this.onComplete,
            onFailure: this.onFailure
        }).send();
    }
});