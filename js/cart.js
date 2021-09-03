import EditLineItemDialog from './lineitem-edit.js'
/**
 * A cart maintains all the ordered items.
 * 
 */
class Cart {
    /**
     * Create a cart.
     * An order must be assoicated with this cart before it can be cheked out.
     */
    constructor() {
        this.items = {}
    }
    /**
     * Static function to get the cart. A single cart is available to all script. 
     * Initializes a cart if necessary
     * @returns an empty cart.
     */
    static instance() {
        if (!singleton) {
            singleton = new Cart()
        }
        return singleton
    }

    /**
     * Creats a dict suitable for template rendering 
     * @returns a dict
     */
    toDict() {
        var lineitems = []
        for (var sku in this.items) {
            lineitems.push(this.items[sku].toDict())
        }
        var result = {
            'order'    : `Order ${this.order.id}`,
            'user'     : `${this.order.user}`,
            'total'    : this.total().toFixed(2),
            'lineitems': lineitems
        }
        return result
    }

    /**
     * affirms if an item with given sku exists in ths cart
     * @param {*} sku 
     * @returns 
     */
    hasLineItem(sku) {
        return sku in this.items
    }

    /**
     * adds or updates given lineitem.
     * 
     * Then this cart updates the UI -- both the number of items on the icon
     * and the line item on the bill.
     * calls given callback with this cart as argument.
     * 
     * @param {LineItem} lineitem a line item
     * @param {function (cart)} cb  optional callback
     * @returns 
     */
    addLineItem(lineitem, cb) {
        if (!lineitem) return
        this.items[lineitem.sku] = lineitem
        console.log(`lineItem [${lineitem.quantity}] to item ${lineitem.sku}`)
        this.render()
        if (typeof cb == 'function')
            cb.call(null, this)
    }

    /**
     * removes the item corresponding to the given sku. Then
     * calls the callback function, if any
     * 
     * If sku does not exisytm, it is a no-op.
     * 
     * @param {String} sku SKU of an item
     * @param {function (cart)} cb  optional callback
     */
    removelineitem(sku, cb) {
        if (sku in this.items) {
            lineitem = this.items[sku]
            delete this.items[sku]
            this.render()
            if (typeof cb == 'function')
                cb.call(null, this)            
        } 
    }

    /**
     * change the quantity of an item identified by given sku.
     * If the item does not exist in this cart, it is a no-op
     * 
     * @param {String} sku sku of the item 
     * @param {int} quantity new quantity  
     * @param {function (cart)} cb  optional callback
     */
    changeQuantity(sku, q, cb) {
        if (sku in this.items) {    
            var existing = this.items[sku]
            existing.quantity = Math.max(1, q)
            this.render()
            if (typeof cb == 'function') cb.call(null, this)
        }
    }

    /*
     * total price of all items in this cart
     * before tax and discount are applied
     * 
     * @return a double
     */
    total() {
        var total = 0.0
        for (var sku in this.items) {
            var li = this.items[sku]
            var price = li.quantity * li.price
            total += price
        }
        return total
    }

    /**
     * adds quantity of each item
     * @returns total number of items in this cart
     */
    countOfItems() {
        var count = 0
        for (var sku in this.items) {
            var li = this.items[sku]
            count = Number(count) + Number(li.quantity)
        }
        return count
    }

    /**
     * cart is rendered two views. The cart icon on the navbar and 
     * the details view of current order
     * 
     * In the icon view,  (CSS selector #cart)  a badge with total items in the cart
     * In the order view, (CSS selector #order) all line items in a table
     */
    render() {
        var $size    = $e($("#cart"), "#cart-size")
        var $details = $('#order')
        var count = this.countOfItems()
        var template = count == 0 ? "templates/cart-empty.mustache" : "templates/cart.mustache"
        //console.log(`loading ${template} with ${JSON.stringify(this.toDict())}`)
        var _this = this
        loadTemplate($details, template, this.toDict(),
            function() {
                _this.updateCount($size, count)
                if (count == 0) return
                // bind action handler to each row 
                var selector = '.lineitem-edit'
                var $editors = $details.find(selector)
                $editors.each(function(){
                    var sku = $(this).attr('id')
                    var li = _this.items[sku]
                    console.log(`editor for lineitem ${li}`)
                    $(this).on('click', function(){
                        new EditLineItemDialog().open(li)
                    })
                })
                var $controls = $e($details, "#cart-controls")
                $e($controls, '#discount-button').on('click', function() {
                    new DiscountManager().fetch(function(code) {
                        console.log(`order is associated with discount code [${code}]`)
                        _this.order.discount_code = code
                        $e($div, '#discount-code').text(code)
                    })
                })
                $e($controls, '#checkout-button').on('click', function(){
                    _this.order.checkout(function(bill) {
                        bill.render()
                    })
                })
                
            }
        )
    }

    /**
     * Updates the count on the icon badge
     * @param {HTMLDiv} $size 
     * @param {int} size 
     */
    updateCount($size, size) {        
        $size.text(size.toString())
        if (size > 0) {
            $size.addClass('w3-green')
            $size.removeClass('w3-red')
        } else {
            $size.addClass('w3-red')
            $size.removeClass('w3-green')
        }
    }


    toString() {
        return `Cart with ${this.countOfItems()} items`
    }
    
}

var singleton;

export default Cart