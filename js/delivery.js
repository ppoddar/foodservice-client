var KEY_DELIVERY = 'delivery'

/**
 * an aggregate client-side object is an aggregation of 
 * bill, address and time
 * 
 */
class Delivery {
    constructor(data) {
        assertKeys(data, ['address', 'time', 'bill'], false)
        this.address = data['address']
        this.time    = data['time']
        this.bill    = data['bill']
    } 

    save() {
        window.sessionStorage.setItem(KEY_DELIVERY, JSON.stringify(this))
    }

    static fromStorage() {
        var data = window.sessionStorage.getItem(KEY_DELIVERY)
        return new Delivery(JSON.parse(data))
    }

    toDict() {
        var result = {}
        result['address'] = this.address
        result['time']    = this.time
        result['bill']    = this.bill
        return result
    }

    /**
     * opens a popup dialog showing the delivery.
     * If user OKes the final information, then calls back the given function 
     * 
     * @param {function} cb callback on OK
     */
    render(cb) {
        var opts = {
            title: 'Delivery',
            buttons: [
                {'text': 'Next (payment)',
                 'click': function() {
                     $(this).closest('.ui-dialog-content').dialog('close')
                     if (cb) cb.call(null)
                 }}
            ]
        }
        openDialog('templates/delivery.mustache', this.toDict(), opts)
    }

    
}

export default Delivery