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
        itemSelectCallback: function(){},
        maxItems: 10,
        imgPath: '/mootocomplete/imgs',
        displaySpinner: true,
        minCharacters: 3,
        limit: 10,
        noResultText: 'No results for this search',
        spinnerGif: '/spinner.gif' //inside the imgPath
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
     * container
     */
    container: null,

    /**
     * Constructor
     */
    initialize: function(field, url, options){
        this.field = field;
        this.url   = url;
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
        $(this.field).addEvent('keyup', this.processAutocomplete.bind(this));
        //$(this.field).addEvent('blur', this.hideAutocomplete.bind(this));
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
        this.container.empty();

        var li = new Element('li', {
            text: this.options.noResultText,
            class: 'mootocomplete-li'
        });
        this.container.adopt(li);

        this.hideSpinnerOnInput();

        this.container.inject(this.field, 'after');
    },

    /**
     * Affiche un autocomplete remplit
     */
    displayFilledAutocomplete: function(values)
    {
        this.container.empty();

        //get a spinner inside the text element for more rock !

        values.forEach(function (text, index) {
            var li = new Element('li', {
                text: text,
                class: 'mootocomplete-li'
            });
            this.configureLi(li);
            this.container.adopt(li);
        }.bind(this));

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
        console.log(this.options.onItemSelect);
        this.options.itemSelectCallback(ev.target.innerHTML);
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
     * Processes Ajax request
     */
    processRequest: function()
    {
        new Request({
            url: this.url,
            method: 'POST',
            data: {
                input: this.field.value,
                limit: this.options.limit
            },
            onSuccess: this.displayAutocomplete.bind(this)
        }).send();
    }

});



