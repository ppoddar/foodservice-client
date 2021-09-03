const SERVER_URL = 'http://localhost:8000'
import DateRangeSelection   from './order-date-selection.js'
import OrderStatusSelection from './order-status-selection.js' 
import OrderTable from './order-table.js'
import OrderTotalSelection  from './order-total-selection.js'

/**
 * selects order from server
 */
class OrderSelection {
    /**
     * selects order by zero or more filters and calls back the given
     * callback function with the selected order array.
     * 
     * @param {string[]} filters that are django operators.
     * if an array element is null it is ignored.
     * @param {function} cb a callback function with order[] as argument
     */
    selectOrders(filters, cb) {
        // weed out any null or undefined filter
        var candidates = this.weedOut(filters)
        console.log(`------------> ${candidates.length} filters: ${candidates}`)
        var payload = {'filters':candidates}
        var url = `${SERVER_URL}/order/query`
        $.ajax({
            url: url,
            method:'POST',
            data: JSON.stringify(payload),
            contentType:'application/json',
            success: function(response) {
                //console.log(JSON.stringify(response))
                if (typeof(cb) == 'function') {
                    cb.call(null, response.data)
                }
            }
        })
    }

    weedOut(array) {
        var result = []
        if (array) {
            for (var i = 0; i < array.length; i++) {
                var e = array[i]
                if (e) result.push(e)
            }
        }
        return result
    }

    /**
     * select today's orders and render them using OrderTable
     * @param {OrderTable} an OrderTable
     */
    viewDailyOrder($div) {
        var filters = new DateRangeSelection().getDefaultFilter()
        this.selectOrders(filters,
        (orders) => {
            new OrderTable().render($div, orders)
        })
    }

    /**
     * Opens a dialog to accept filter conditions or date range, status, total.
     * Executes the filters on sever and display the resultant orders
     * 
     * @param {*} $div 
     */
    viewOrder($div) {
        var _this = this
        var $dialog = $('<div>')
        var $dateRangeSelectionSection   = $('<div>')
        var $orderStatusSelectionSection = $('<div>')
        var $orderTotalSelectionSection  = $('<div>')
        $dialog.append([
            $dateRangeSelectionSection, 
            $orderStatusSelectionSection, 
            $orderTotalSelectionSection])
        var dateRangeSelection   = new DateRangeSelection($dateRangeSelectionSection)
        var orderStatusSelection = new OrderStatusSelection($orderStatusSelectionSection)
        var orderTotalSelection  = new OrderTotalSelection($orderTotalSelectionSection)
        //$dialog.accordion()
        var opts = {
            'autoOpen': true, 'modal': true,
            'title': 'Select orders',
            'width': 500, height: 600,
            'buttons':[
                {'text': 'OK',
                 'click': () => {
                    var filters = [].concat(dateRangeSelection.getFilters())
                        .concat(orderStatusSelection.getFilters())
                        .concat(orderTotalSelection.getFilters())
                     $dialog.dialog('close')
                     _this.selectOrders(filters,
                        (orders) => {new OrderTable().render($div, orders)})
                 }
                }
            ]
        }
        $dialog.dialog(opts)
    }
    
}


export  default OrderSelection
