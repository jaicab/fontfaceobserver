goog.provide('fontface.Detector');

goog.require('dom');

goog.scope(function () {
    /**
    * @constructor
    * @param {string} family
    */
    fontface.Detector = function(family) {

        /**
        * @type {string}
        */
        this['font'] = family;

        // a font will be compared against all the three default fonts.
        // and if it doesn't match all 3 then that font is not available.
        this['baseFonts'] = ['monospace', 'sans-serif', 'serif'];

        //we use m or w because these two characters take up the maximum width.
        // And we use a LLi so that the same matching fonts can get separated
        var testString = "mmmmmmmmmmlli";

        //we test using 72px font size, we may use any size. I guess larger the better.
        var testSize = '72px';

        this['h'] = document.getElementsByTagName("body")[0];

        // create a SPAN in the document to get the width of the text we use to test
        this['s'] = dom.createElement("span");
        this['s'].setAttribute('aria-hidden', 'true');
        this['s'].style.fontSize = testSize;
        dom.append(this['s'], dom.createText(testString));
        this['defaultWidth'] = {};
        this['defaultHeight'] = {};
        for (var index in this['baseFonts']) {
            //get the default width for the three base fonts
            this['s'].style.fontFamily = this['baseFonts'][index];
            this['h'].appendChild(this['s']);
            this['defaultWidth'][this['baseFonts'][index]] = this['s'].offsetWidth; //width for the default font
            this['defaultHeight'][this['baseFonts'][index]] = this['s'].offsetHeight; //height for the defualt font
            dom.remove(this['h'], this['s']);
        }
    };

    var Detector = fontface.Detector;

    /**
    * @return {boolean}
    */
    Detector.prototype.detect = function(){
        var detected = false;
        for (var index in this['baseFonts']) {
            this['s'].style.fontFamily = this['font'] + ',' + this['baseFonts'][index]; // name of the font along with the base font for fallback.
            dom.append(this['h'], this['s']);
            var matched = (this['s'].offsetWidth != this['defaultWidth'][this['baseFonts'][index]] || this['s'].offsetHeight != this['defaultHeight'][this['baseFonts'][index]]);
            dom.remove(this['h'], this['s']);
            detected = detected || matched;
        }
        return detected;
    };


});