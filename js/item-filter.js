import { PRE_DEFINED_CATEGORIES } from "./categories.js"

class ItemFilter {
    open($div) {
        var _this = this
        var $dialog = $('<div>')
        var data = {'categories': PRE_DEFINED_CATEGORIES}
        loadTemplate($dialog, 'templates/item-filter.mustache', data, function($dialog) {
            var opts = {
                buttons: [
                    {
                        'text': 'Filter',
                        'click': function() {
                            if (_this.validate($(this))) {
                                var filters = 
                                    [].forEach();
                                sendServerRequest(filters, function(response) {

                                })
                            }
                        }
                    }
                ]
            }
            $dialog.dialog(opts)
        })
    }

}

class ItemFilterByDate {
    getFilters() {
    }
}

class ItemFilterByPrice {
    getFilters() {
        var lowest_price  = $('#lowest_price').val()
        var highest_price = $('#highest_price').val()
        return [`price__lte=${highest_price}`, `price__gte=${lowest_price}`]
    }
}

class ItemFilterByCategory {
    
}

export default ItemFilter