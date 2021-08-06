import BillItem from "./billitem.js"
/**
 * server produces a bill and sends a JSON reponse.
 * a bill is constructed on the browser client form that JSON response
 */
var TEMPLATE = "templates/bill.mustache"
var KEY_BILL = 'bill'
class Bill {
    constructor(bill) {
        this.id    = bill['id']
        this.total = Number(bill['total']).toFixed(2)
        const options = { hour: '2-digit', minute:'2-digit', year: 'numeric', month: 'short', day: '2-digit' };
        var date = bill['date']
        var typeName = date.constructor.name
        console.log(`received date ${date} is of type ${typeName}`)
        if (typeName  ==  'String') {
            this.date  = new Date(date).toLocaleDateString('en-US', options)
        } else {
            this.date = date.toLocaleDateString('en-US', options)
        }
        this.payment_id = bill['payment_id']
        var items = []
        var bill_items = bill['bill_items']
        for (var i=0; bill_items && i < bill_items.length; i++) {
            items.push(new BillItem(bill_items[i]))
        }
        this.items = items
        console.log(`created Bill ${JSON.stringify(this)}`)
    }

    toDict() {
        var result = {}
        result['id']    = this.id
        result['total'] = this.total
        result['date']  = this.date
        result['payment_id'] = this.payment_id
        result['items'] = this.items
        
        return result
    }


    /**
     * Renders the bill as Popup.
     * Simalar to the order rendering
     *      
     * @see Cart#render
     */
    render() {
        var _this = this
        var opts = {
            autoOpen: true,
            modal: true,
            title: `Bill ${this.id}`,
            width:  '500',
            height: '600',
            buttons :[
                {'text': 'Order more..', 
                    'click': function() {
                        $(this).closest('.ui-dialog-content').dialog('close'); 
                    }   
                },

                {'text': 'Next (Delivery)', 
                    'click': function() {
                        _this.save()
                        $(this).closest('.ui-dialog-content').dialog('close'); 
                        window.location = './delivery.html'
                    }
                }
            ]
        }
        openDialog('templates/bill.mustache', _this.toDict(), opts)
        
    }

    save() {
        // bill is saved with bill_items
        var data = JSON.stringify(this.toDict())
        window.sessionStorage.setItem(KEY_BILL, data)
    }

    static fromStorage() {
        var str = window.sessionStorage.getItem(KEY_BILL)
        if (str) {
            var bill = new Bill(JSON.parse(str))
            return bill
        }

    }

}

export default Bill