import WizardPage from "./wizardpage.js"

/** 
 * Am wizard controls a serials of pages.
 * The pages are presnted in the order of their addition to the wizard.
 * The wizard provides the naviagtion buttons next, back, finish depending
 * on a pages position is the sequence.
 */
class Wizard {
    /**
     * construct an wizard with options
     * @param {dict} data optional dictionary with following properties
     *     title
     *     width
     *     height
     */
    constructor(data, pages) {
        this.pages    = []
        for (var i = 0; pages && i < pages.length; i++) {
            this.addPage(pages[i])
        }
        data = data || {}
        this.section = data['section'] || ''
        this.title  = data['title']    || 'no title'
        this.width  = data['width']    ||  500
        this.height = data['height']   || 400
        this.payload  = {}
        this.cursor   = 0
        
        var _this = this
        this.goNext = function() {
            _this.showPage(_this.cursor+1)
        }
        this.goPrev = function()  {
            _this.showPage(_this.cursor-1)
        }
        this.finish = function()  {
            _this.getPageAt(_this.cursor).close()
            for (var i = _this.cursor; i < _this.pages.length; i++) {
                _this.collectInputFromPage(i)
            }
            _this.callback.call(_this, _this.payload)
        }
    }

    collectInputFromPage(idx) {
        var page = this.getPageAt(idx)
        var data = page.collect()
        if (page.section) {
            this.payload[page.section] = data
        } else {
            Object.assign(this.payload, data)
        }
    }

    /**
     * Adds an wizard page.
     * @param {WizardPage} page 
     */
    addPage(page) {
        if (page)
            if (page instanceof WizardPage)
               this.pages.push(page)
            else
                throw `${page.constructor.name} is not a WizardPage`
    }
    
    getPageAt(idx) {
        if (idx < this.pages.length && idx >= 0)
            return this.pages[idx]
    }
    /**
     * Opens this wizard. Displays the first page.
     * @param {fn} cb callback function. The function wil be called
     * back with a dictionary of input values as supplied by each page
     */
    open(cb) {
        console.assert(cb, 'no callback for the wizard to open')
        this.callback = cb
        this.showPage(0)
    }

    /**
     * shows a dialog at given index
     * hides the dialog currently being shown
     * changes the cursor to given index
     * @param {*} idx 
     */
    showPage(idx) {
        console.log(`showPage ${idx}`)
        var page = this.getPageAt(this.cursor) 
        if (page.$dialog != undefined) {
            var valid = page.validate()
            if (!valid) return
            this.collectInputFromPage(this.cursor)
            page.close()
        }

        this.cursor = idx
        var opts = this.optionsFor(idx)
        page = this.getPageAt(idx)
        if (page) page.open(opts)
    }


    
    /**
     * gets the options for page at given index
     * @param {int} idx 
     * @returns a dictinary of dialog options
     */
    optionsFor(idx) {
        if (idx < 0) return
        if (idx >= this.pages.length) return
        
        var page = this.pages[idx]
        // the navigation buttons. Each associate with a function
        var next   = {'id':'next',   'text':'next',   'click': this.goNext}
        var prev   = {'id':'back',   'text':'back',   'click': this.goPrev}
        var finish = {'id':'finish', 'text':'finish', 'click': this.finish}
        // buttons are present based on the pages position within this wizard
        var buttons = []
        if (idx == 0) {
            buttons = [next]
        } else if (idx == this.pages.length -1) {
            buttons = [prev, finish]
        } else {
            buttons = [prev, next, finish]
        }
        var opts = {
            autoOpen  : true,
            modal     : false,
            minWidth  : this.width,
            minHeight : this.height,
            title     : page.title,
            buttons   : buttons  
        }
        return opts
    }
}
export default Wizard