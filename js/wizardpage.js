/**
 * A page in a series of pages managed by an wizard.
 */
// TODO: LOGO_URL
var LOGO_URL = 'http://localhost:8000/static/logo.png'

class WizardPage {
    /**
     * template*
     * title 
     * width
     * height
     * @param {*} data 
     */
    constructor(data) {
        data = data || {}
        this.section   = data['section'] || ''
        this.template  = data['template']
        this.title  = data['title']  || ''
        this.width  = data['width']  || 300
        this.height = data['height'] || 200
        this.dialog = undefined 
    }
    /**
     * renders this page using a template. The given $div 
     * is set to the rendered html.
     * The data to populate the template is supplied by toDict() method
     * 
     * @param parameters optional. user inputs collected so far 
     * by the wizard. 
     * sometime, rendering of one page depends on the input to
     * the previous pages.
     */
    render(parameters) {
        var _this = this
        if (this.template) {
            var data = Object.assign(this.toDict(), parameters || {})
            data['logo'] = LOGO_URL
            $.get(this.template, function(template){
                var html = Mustache.render(template, data)
                _this.$dialog.html(html)
            })
        }
    }
    /**
     * gets the user input values in a dictionary. 
     * look up the HTML elements <input>  
     * that are specified in its template
     * and extract their value.
     * The resultant dictonary is merged with overall payload
     * maintane by the wizard. 
     * @param {array} the list of <input> element ids to collect from 
     * @returns a dict. 
     */
    collect(keys) {
        var result= {}
        if (this.$dialog) {
            for (var i =0; i < keys.length; i++) {
                var key = keys[i]
                var val = this.$dialog.find('#'+key).val()
                result[key] = val
            }
        }
        return result
    }

    toDict() {
        return {}
    }

    validate() {
        this.clear_error()
        return true
    }

    /**
     * Opens the page. On first call, the page creates a jQuery dialog element
     * out of a simple <div>.
     * 
     * @param {*} opts options for the dialog
     */
    open(opts) {
        if (this.$dialog == undefined) {
            console.log(`creating new dialog for ${this.constructor.name}`)
            this.$dialog = $('<div>')
            this.$dialog.attr('id', this.constructor.name) // for debug tracing
            this.render()
        } 
        this.$dialog.dialog(opts)
        
    }

    close() {
        this.$dialog.closest('.ui-dialog-content').dialog('close')
    }

    clear_error() {
        var $error = $e(this.$dialog,'#error')
        $error.addClass("w3-hide")
    }
    show_error(message) {
        var $error = $e(this.$dialog,'#error')
        console.error(message)
        $e($error, "#message").html(message) 
        $error.removeClass("w3-hide")
        this.$dialog.effect("shake", { times: 5 }, 100);
    }
}
export default WizardPage