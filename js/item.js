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
        this.short_description = fromDict(data, 'short_description', '')
        this.long_description  = fromDict(data, 'long_description', '')
        this.price       = fromDict(data,'price')
        this.ratings     = fromDict(data,'ratings', 3)
        this.image       = fromDict(data,'image', NO_IMAGE)
        var categories   = fromDict(data,'categories', '')
        this.categories  = this.parseAsArray(categories)

        return this
    }

    /**
     * 
     * @returns converts to a dictionary.
     */
    toDict() {
        return {
            'sku' : this.sku,
            'name': this.name,
            'short_description': this.short_description,
            'long_description': this.long_description,
            'price': this.price,
            // Important: add the STATIC_URL here 
            'image' : `${STATIC_URL}/${this.image}`,
            'categories':this.categories
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
        var $item = $('<div>')
        var html = Mustache.render(template, this.toDict())
        $item.html(html)
        var $ratings = new Ratings(this.ratings).render()
        $item.find('#ratings').first().append($ratings)
        $item.data('item', this)

        // the template must define two elements with id 'order-button' and 'item-quantity'
        // a single click of 'order-button' will add to a lineitem to the cart
        // update the cart
        $item.find('#order-button').on('click', (e) => {
            var quantity = $item.find('#item-quantity').val()
            var item = $item.data('item')
            var lineitem = new LineItem(item, quantity)
            Cart.instance().addLineItem(lineitem)
        }) 
        $item.find('#item-quantity').on('dblclick', function(e) {
            e.preventDefault()
            e.stopPropagation()
            return false
        })
        $item.on('click', function(e){
            e.preventDefault()
            e.stopPropagation()
            return false
        })
        $item.on('dblclick', function(e) {
            var item = $(this).data('item')
            new OrderForm(item).open()
            return false
        })
        return $item
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
}

export default Item