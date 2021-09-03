import Cart from './cart.js'
import LineItem from './lineitem.js'
import OrderForm from './order-form.js'
import Ratings from './ratings.js'

const SERVER_URL="http://localhost:8000"
const STATIC_URL=`${SERVER_URL}/static`
const NO_IMAGE = ""
const TEMPLATE = 'templates/item.mustache'

class Item {
    /**
     * construct an item from given dictionary
     * @param {*} data 
     */
    constructor(data) {
        this.init(data)
    }

    init(data) {
        //console.log(`item<init> from ${JSON.stringify(data)}`)
        this.sku         = fromDict(data,'sku')
        this.name        = fromDict(data,'name')
        this.short_name  = fromDict(data,'short_name', '')
        if (!this.short_name || this.short_name.trim()=='') this.short_name = this.name
        this.short_description = fromDict(data, 'short_description', '')
        this.long_description  = fromDict(data, 'long_description', '')
        this.price       = fromDict(data,'price')
        this.has_half    = 'half_price' in data && fromDict(data, 'half_price') > 0.0
        this.half_price  = fromDict(data,'half_price', 0.0)
        this.ratings     = fromDict(data,'ratings', 3)
        this.image       = fromDict(data,'image', NO_IMAGE)
        var categories   = fromDict(data,'categories', '')
        this.categories  = this.parseAsArray(categories)

        return this
    }

    /**
     * Converts state of this item into a dictionary. Used to render it
     * in a template. The Mustache template is logic-less. Hence, all
     * decisions (such as wherther half plate price is available) are
     * made via this dictionary
     * @returns converts to a dictionary.
     */
    toDict() {
        return {
            'sku' :         this.sku,
            'name':         this.name,
            'short-name':   this.short_name,
            'short-description':    this.short_description,
            'long-description':     this.long_description,
            'price':        this.price,
            'has-half':     this.has_half ? 'checked' : '',      
            'half-price':   this.half_price,
            // Important: add the STATIC_URL here 
            'image' :       `${STATIC_URL}/${this.image}`,
            // categories is shown as space-separated string
            'categories':   this.categories.join(' ')
        }
    }
    
    /*
     * Initializes the template and calls back the given function
     * on this item itself i.e, inside the function 'this' will
     * refer to the same instance on which this function had been invoked
     * @see #render()
     */
    initTemplate(cb) {
        var _this = this
        $.get(TEMPLATE, function(data) {
            _this.template = data
            if (cb) cb.call(_this)
        })
    }

    toString() {
        return `Item: [${this.sku}:${this.name}]` 
    }

    /**
     * renders this item using a template and adds the element created
     * by applying the template to the given container.
     * The template is initialialized by this method, if needed.
     * The template is fetched from server asynchronously.
     * The template is cached. If multiple items are being rendered,
     * only a single ajax call to server is made to fetch the template
     * for the first time, if needed.
     * 
     * @param {*} $div 
     */
    render($div) {
        if (!this.template) {
            this.initTemplate(function() {
                var $item = this.applyTemplate(this.template)
                $div.append($item)
            })
        } else {
            var $item = this.applyTemplate(this.template)
            $div.append($item)
        }
    }


    /**
     * Apply a template to this item to create a jquery element.
     * 
     * The given template is applied on the receiver's state to crete 
     * an HTML (jquery) element.
     * Note: The rendering for ratings (which shows icons/stras) are down outside
     * the template. 
     * 
     * Note: The action handlers are added to the jquery element.
     *  
     * @retunrs a jQuery element.  
     */
    applyTemplate(template) {
        this.$view = $('<div>')
        var html = Mustache.render(template, this.toDict())
        this.$view.html(html)
        var $ratings = new Ratings(this.ratings).render()
        this.$view.find('#ratings').first().append($ratings)
        this.$view.data('item', this)

        // the template must define two elements with id 'order-button' and 'item-quantity'
        // a single click of 'order-button' will add to a lineitem to the cart
        // update the cart
        this.$view.find('#order-button').on('click', (e) => {
            var lineitem = new LineItem({
                'item'    : this.$view.data('item'), 
                'quantity': $e(this.$view,'#item-quantity').val(),
                'half'    : $e(this.$view, '#half-plate').is(':checked')})
            Cart.instance().addLineItem(lineitem)
        }) 
        this.$view.find('#item-quantity').on('dblclick', function(e) {
            e.preventDefault()
            e.stopPropagation()
            return false
        })
        this.$view.on('click', function(e){
            e.preventDefault()
            e.stopPropagation()
            return false
        })
        this.$view.on('dblclick', function(e) {
            var item = $(this).data('item')
            new OrderForm(item).open()
            return false
        })
        return this.$view
    }

    parseAsArray(names) {
        var result = []
        if (!names) return result
        var start = names.startsWith('[') ? 1 : 0
        var end = names.endsWith(']') ? 1 : 0
        names = names.substring(start, names.length-end).split(',')
        for (var i =0; i < names.length; i++) {
            var name = names[i].trim()
            var s = name.startsWith("'") ? 1 : 0;
            var e = name.endsWith("'") ? 1 : 0;
            name = name.substring(s, name.length-e)
            result.push(name)
        }
        return result
    }

    changeQuantity(q) {
        if (this.$view) {
            $e(this.$view, '#item-quantity').val(q)
        }
    }
}

export default Item