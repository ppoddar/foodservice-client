var TEMPLATE = 'templates/lineitem.mustache'

/**
 * creates a line item from an item.
 * The name of the line item is either the name of the item or, if its longer, 
 * then the short name.
 * The item sku and price are also properties of a line item. 
 * 
 * // TODO: short name
 */
class LineItem {
    constructor(data) {
        var item      = data['item']
        this.sku      = item.sku
        this.name     = item.short_name
        this.price    = item.price
        this.quantity = 'quantity' in data ? data['quantity'] : 1
        this.half     = 'half' in data ? data['half'] : false
        if (half) {
            this.price = item.half_price
        }
    }
    /**
     * converts this lineitem to a dictionary useful for ajax payload.
     * keys are: [sku, name, price, quantity]
     * @returns a dict
     */
    toDict() {
        var result = {}
        result['sku']        = this.sku;
        result['name']       = this.name
        result['quantity']   = this.quantity;
        result['price']      = this.price
        // the dict property for a line item has 'cost' 
        // because Mustache template can not and does not have to calculate 
        result['cost']       = Number(this.price * this.quantity).toFixed(2)

        return result
    }
    /**
     * renders this line item using a cached template
     * @param {*} $div 
     */
    render($div) {
        //console.log('lineitem render')
        if (this.template) {
            this.applyTemplate($div, this.template)
        } else {
            var self = this
            $.get(TEMPLATE, function(data) {
                self.template = data
                self.applyTemplate($div, self.template)
            })
        } 
    }

    /**
     * apply the given template to create an html.
     * The given div is set to that html 
     * @param {*} $div 
     * @param {*} template 
     */
    applyTemplate($div, template) {
        var html = Mustache.render(template, this.toDict())
        $div.append(html)
    }

    toString() {
        return `LineItem ${this.sku} [${this.name}]`
    }
}



export default LineItem