Mootocomplete
=============

By guiguiboy
Version 0.1a

Description
-----------
A personal implementation of autocomplete using Mootolos 1.4.5.

Currently in alpha, use at your own risks ! API may change a lot ... And there is a lot of things to improve.

Mootocomplete is an autocompleter to use when you need an autocomplete that can handle ajax queries.
The filtering + ordering is done on the server side. Mootocomplete only displays the results on the client.

Usages
------

See index.html for full demonstration.


How to install
--------------

* get sources via git checkout or download zip file from github

* copy sources in your web server directory (for example /var/www/mootocomplete/)

* configure web server

* start your web browser and go to the url you specified on your web server the step before


Options
-------
Mootocomplete supports the following options : 
 - mootocompleteClass : CSS class for the autocompleter
 - itemSelectCallback : callback performed on item selection
 - displayEmptyItem : when results are found, allows to display an additional li to cancel the autocomplete
 - emptyItemText : Text displayed on empty item li (if displayEmptyItem is set to true)
 - emptyItemClass : CSS class for empty item
 - liItemClass : CSS class for standard li item
 - imgPath : path to images folder
 - displaySpinner : displays a spinner
 - minCharacters : starts the autocompleter when there is at least minCharacters
 - limit : limits the number of results (this is sent to the server for processing)
 - noResultText : text displayed when no results were found
 - ajaxRequestHandlerClass : Mootools class to handle ajax queries
 - spinnerGif : spinner gif (if displaySpinner is set to true)


Customize
---------

Mootocomplete comes with the default stylesheet style.css.


List of improvements to be done
-------------------------------

 - handle hidden input elements (such as ids) when the server returns a json with  key/value pairs
 - bold searched characters that are in the response
 - add up, down keys control
 - ask javascript guru how to improve this script
 - unit tests (but with what lib ??!)