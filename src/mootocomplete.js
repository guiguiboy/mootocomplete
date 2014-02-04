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
        dataSource: null,
        itemClass: null,
        maxItems: 10,
        imgPath: '/imgs',
        displaySpinner: true,
        spinnerGif: 'spinner.gif' //inside the imgPath
    },

    /**
     * Element
     */
    field: null,

    /**
     * boolean
     */
    isActive: true,

    /**
     * container
     */
    container: null,

    /**
     * Constructor
     */
    initialize: function(field, options){
        this.field = field;
        this.setOptions(options);
        this.addListeners();
        this.container = new Element('ul', {class: 'mootocomplete-ul'});
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
        $(this.field).addEvent('keyup', this.displayAutocomplete.bind(this));
        //$(this.field).addEvent('blur', this.hideAutocomplete.bind(this));
    },

    /**
     * Process l'affichage de l'autocomplete
     */
    displayAutocomplete: function()
    {
        var li;
        if (!this.isActive)
            return;

        this.displaySpinnerOnInput();
        var values = this.getValues();

        this.container.empty();

        //get a spinner inside the text element for more rock !

        for (var i in values) {
            li = new Element('li', {
                text: values[i],
                class: 'mootocomplete-li'
            });
            this.configureLi(li);
            this.container.adopt(li);
        }

        this.hideSpinnerOnInput();

        this.container.inject(this.field, 'after');

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
        this.hideAutocomplete();
    },

    /**
     * Hides autocomplete
     */
    hideAutocomplete: function()
    {
        this.container.empty();
        this.container.destroy();
    },

    /**
     * Returns values for the autocomplete
     */
    getValues: function()
    {
        return this.options.dataSource.getValues();
    }



});

var MootocompleteDataSourceArray = new Class({

    type: 'array',

    values: {},

    initialize: function(values)
    {
        this.values = values;
    },

    getValues: function()
    {
        return this.values;
    }

});


var MootocompleteDataSourceAjax = new Class({

    type: 'ajax',

    /**
     * uri to perform the request
     */
    uri: null,

    /**
     * data-type (ie: JSON)
     */
    type: null,

    /**
     * Initialize
     *
     * @param uri
     * @param type
     */
    initialize: function(uri, type)
    {
        this.uri = uri;
        this.type = type;
    },

    /**
     * Process Ajax Request
     */
    getValues: function()
    {

    }

});


