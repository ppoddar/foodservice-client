import Ratings  from './ratings.js'
import LineItem from './lineitem.js'
import Cart     from './cart.js'
import Menu     from './menu.js'
import Settings from './settings.js'

const TEMPLATE = 'templates/order-form.mustache'
class OrderForm {
    constructor(item) {
        this.item = item
        this.haveAskedForAdditionalItems = false
        this.actualOrder = false
    }
    /**
     * opens a dialog to order an item.
     * An order form would collect the information about an order,
     * quantity and additional instructions via a separate dialog.
     */
    open() {
        var _this = this
        //console.log(`open order form for ${JSON.stringify(item)}`)
        var orderFunction = function() {
            //var lineitem = new LineItem(_this.item, quantity)
            var lineitem = new LineItem({
                'item'    : _this.item, 
                'quantity': parseInt($(this).find('#item-quantity').val()),
                'half'    : $(this).find('#half-plate').is(':checked')})
            
            Cart.instance().addLineItem(lineitem)
            _this.item.changeQuantity(quantity)
            _this.actualOrder = true
            $(this).dialog('close')
        }
        
        openDialog(TEMPLATE, this.item.toDict(), {
             'width':  500,
             'height': 400,
             'title': `Order ${this.item.name}`,
             'buttons': [
                 {text: 'Order',
                  click: orderFunction
                }
            ],
            'close': this.askForAdditionalItems.bind(this)
        })
        
    }

    askForAdditionalItems() {
        console.log(`called askForAdditionalItems() actual order=${this.actualOrder} askedForAdditionalItems=${this.haveAskedForAdditionalItems} settings.askForAdditionalItems= ${Settings.instance().askForAdditionalItems}`)

        // this method gets invoked when dialog is closed
        // However, a dialog can be closed whe cancel button is closed. Do not open when the dialog was closed by 'Cancel' button
        // or rather open it only if dialog is closed after an actual order was placed 
        if (!this.actualOrder) return
        // do not open it if it has been called once
        if (this.haveAskedForAdditionalItems) return
        // do not open it user has asked not to
        if (!Settings.instance().askForAdditionalItems) return

        this.haveAskedForAdditionalItems = true
        var recommendations = Menu.instance().getRecommendation(this.item.sku)
        console.log(`recommendation for item [${this.item.sku}]: ${recommendations}`)
        if (recommendations) {
            var data = []
            for (var i = 0; i < recommendations.length; i++) {
                var reco = recommendations[i]
                var other = Menu.instance().findItemBySKU(reco)
                var name = other.name
                if (name.length > LineItem.MAX_NAME_LENGTH) {
                    name = other.short_name
                }
                console.log(`recommendation [${i}] == ${JSON.stringify(other)}`)
                data.push({'sku': other.sku, 'name': name, 'price': other.price})
            }
            openDialog('templates/recommendation.mustache', {'recommendation':data}, 
                {   title: 'additional items',
                    open : function() {
                        $(this).find('#ask-for-additioal-items').on('click', function() {
                            Settings.instance().askForAdditionalItems = !$(this).is(':checked')
                        }) 
                    },
                    buttons: [
                    {'text': 'No, Thanks',
                        'click': function() {$(this).dialog('close')}
                    },
                    {'text': 'Add',
                        'click': function() {
                        var checked = $(this).find('input[type=checkbox]:checked')
                        
                        checked.each(function($el) {
                            if ($(this).attr('id') != 'ask-for-additional-items') {
                            // each checkbox has item sku as id. Set by the template 
                            var s = $(this).attr('id')
                            var q = $(this).parents('tr').find('input[type=number]').first().val()
                            console.log(`selected ${q} of additional item ${s}`)
                            try {
                                var additional_item = Menu.instance().findItemBySKU(s)
                                var li = new LineItem({'item':additional_item, 'quantity':q})
                                Cart.instance().addLineItem(li)
                            } catch (err) {
                                // pass
                                console.log(err.message)
                            }
                        }})
                        $(this).dialog('close')}
                    }
                ]
            })
        }
    }
}

export default OrderForm