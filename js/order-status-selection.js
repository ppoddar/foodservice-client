/**
 * Renders the possible order status as checkboxes.
 * The user can select one or many status.
 * Creates a filter based on user selection.
 * the filters are django query operators
 */
class OrderStatusSelection {
    constructor($div) {
        // all status are selected initialiiy
        this.choices = [
            {'id': 'OPEN',         'label': 'open orders',   'status': 'NEW'},
            {'id': 'PLACED',       'label': 'placed',        'status': 'PLACED', 'checked':'checked'},
            {'id': 'DUE',          'label': 'payment due',   'status': 'DUE'},
            {'id': 'IN_DELIVERY',  'label': 'in delivery',   'status': 'IN_DELIVERY'},
            {'id': 'DELIVERED',    'label': 'delivered',     'status': 'DELIVERED'},
            {'id': 'COMPLETE',     'label': 'complete',      'status': 'COMPLETE'}
        ]

        if ($div) {
            this.render($div)
        }
    }

    render($div) {
        this.$view = $div
        $.get('templates/order-status-choices.mustache', (template) => {
            var data = {'choices': this.choices}
            var html = Mustache.render(template, data)
            $div.html(html)
        })   
    }

    /**
     * gets a django query operator that performs IN operation.
     * At least one status must be selecetd.
     * If either no status is checekd or all status are checked, 
     * it implies that no filtering on order status to be performed.
     * 
     * @returns null or a IN query clause as a single-elemedivnt array
     */
    getFilters() {
        var _this = this
        var selector = `input[type=checkbox]:checked`
        if (this.$view.find(selector).length == this.choices.length
         || this.$view.find(selector).length == 0) {
            // every status or no status is selected == status is not a criterion
            return null
        }
        
        // otherwise, pick up the  status of checked boxes
        var status_selected = []
        this.$view.find(selector).each( function(i, el) {
            var id = $(el).attr('id')
            // template has ensured each checkbox id is same as the choice id
            for (var i = 0; i < _this.choices.length; i++) {
                if (_this.choices[i].id == id) {
                    status_selected.push(_this.choices[i].status)
                }
            }
        }) 
        //console.log(`selected statuses: ${status_selected.join()}`)
        return [`status__in=(${status_selected.join()})`]
    }
}

export default OrderStatusSelection