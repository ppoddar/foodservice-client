import Bill from './bill.js'
import Cart from './cart.js'
import DiscountManager from './discount_manager.js'
import User from './user.js'

const SERVER_URL="http://localhost:8000"

class Order {
    /**
     * Initializes an order.
     * Pre-condition: order.user must be set
     * @param {*} user 
     * @param {*} cb a callback function where this == this order
     */
    init(cb) {
        if (!this.user) 
            throw '***ERROR:no user has been set for this order'
        var _this = this
        $.ajax({
            url: `${SERVER_URL}/order/init/${_this.user}`,
            success: function(response) {
                console.log(`received response ${JSON.stringify(response)}`)
                _this.id   = response.data.id
                _this.user = response.data.user
                _this.created_at = response.data.created_at
                console.log(`initialized order ${JSON.stringify(_this)}`)
                if (cb) cb.call(null, _this)
            }
        })
    }

    /**
     * Renders current state of an order.
     * The order number shown in header.
     * The items are shown in a list.
     * The running balance (without tax and discount) shown as total
     * The 'apply-discount' and 'checkbutton' action handlers are set
     * 
     * @param {*} $div 
     */
    render($div) {
        console.log(`rendering ${JSON.stringify(this)}`)
        $e($div, '#order-id').text(`Order ${this.id}`)
        //$div.find('#order-user').text(this.user)
        // var t = Date.parse(this.created_at)
        // var now = Date.now()
        // var diff = (now - t)/(1000) 
        // $div.find('#order-time').text(diff + " seconds ago")

        var _this = this
        $e($div, '#discount-button').on('click', function() {
            new DiscountManager().fetch(function(code) {
                console.log(`order is associated with discount code [${code}]`)
                _this.discount_code = code
                $e($div, '#discount-code').text(code)
            })
        })
        $e($div, '#checkout-button').on('click', function(){
            _this.checkout(function(bill) {
                bill.render()
            })
        })
            
    }

    toString() {
        return `order ${this.id} for ${this.user}`
    }

    /**
     * Prepares a bill with the items in the singleton shopping cart.
     * The order must have an id and may have a discount code. 
     * 
     * The server prepares a bill. The bill is saved in browser
     * session storage.
     * Calls back the given function with the retunred bill as argument
     */
    checkout(cb) {
        //alert(`checkout cart size ${cart.countOfItems()} items`)
        console.log(`checkout with user: ${this.user} and ${Cart.instance()}`)
        var url     = `${SERVER_URL}/order/place/${this.id}`
        var payload = {'lineitems': Cart.instance().toDict()}
        console.log(`sending POST request ${JSON.stringify(payload,4)}`)
        var _this = this
        var _callback = cb
        $.ajax({
            url: url,
            method: 'POST',
            data: JSON.stringify(payload),
            contentType: 'application/json',
            success: function(response) {
                var status = response['status']
                console.log(`checkout request server returns status: [${status}]`)
                if (status == 200) {
                    var bill = new Bill(response['data'])
                    bill.save()
                    if (cb) cb.call(null, bill)
                } else if (status == 301) { // needs to log in
                    console.log(`***WARNING: checkout requires login. New dialog will open`)  
                    openWarningDialog('Login required','you must login to place an order',
                        function() {
                            User.instance().ensureLogin(function(user, isNew) {
                                if (isNew) {
                                    console.log(`new user [${user}] has logged in. This order is reassigned to him/her`)
                                    _this.user = user.username
                                } 
                                // retry the same operation with logged in user
                                console.log(`checkout again with ${_this.user}`)
                                checkout(_callback)
                            })
                        })
                } else { // things are broken
                    openErrorDialog('error during checkout', response['message'])
                }
            }
        }) 
    }


    /**
     * raises a dialog showing all the discounts available to current user.
     * The user selects a discount on the dialog. The seleted discout is set on
     * the order. 
     */
     
    /**
     * 1. Prepares a bill for the current order.
     * 2. Displays the bill one the cart area
     * 3. Saves the bill id on the session storage
     * 4. Proceeds to delivery page
     * the action are carries out in Order#checkout with a callabck
     */
    
}
export default Order