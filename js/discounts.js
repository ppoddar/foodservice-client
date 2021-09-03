
const TEMPLATE = 'templates/discount-dialog.mustache'
const DISCOUNT_GROUP = 'discount_group'
const SERVER_URL="http://localhost:8000"

/**
 * A viewcontroller for all discounts
 */
class Discounts {
    constructor(data) {
        console.log(`initializing discounts from ${data.length} discounts`)

    }
    /**
     * fetch all discounts and applies the view template to raise 
     * a dialog
     * 
     * @param cb a callback function. This function will be called when
     * the dialog 'OK' button is selected. The function should have a
     * string argument which is the code for selected discount
     */
    fetch(cb) {
        var _this = this
        var url = '${SERVER_URL}/bill/discounts/'
        //console.log(`DiscountManager ${url}`)
        $.ajax({
            url: url,
            success: function(response) {
                var discounts = response.data
                var status = response['status']
                //console.log(`DiscountManager status ${status} response ${JSON.stringify(discounts)}`)
                if (status == 200) {
                    _this.applyTemplate({
                        'group':DISCOUNT_GROUP, 
                        'discounts': discounts}, 
                        cb)
                }
            }
        })
    }

    /**
     * applies the template. The "OK" button will call the callback
     */
    applyTemplate(data, cb) {
        console.log(`applyTemplate ${JSON.stringify(data)}`)
        var okFn = function() {
            // $(this) is the entrire dialog
            var $selectedNode = $(this).find(`input[name=${DISCOUNT_GROUP}]:checked`).first()
            if ($selectedNode.length == 0) {

                openWarningDialog('no discount seleetd', 'you have not selected any discount code')
            }
            var code = $selectedNode.attr('id')
            console.log(`CSS selector seletced [${code}]`)
            $(this).closest('.ui-dialog-content').dialog('close')
            cb.call(null, code)
        }
        var opts = {
            'title': 'Select and Apply Discount to Bill',
            'width': 500, 'height':600,   
            'buttons':[
                {'text': 'Apply',
                'click': okFn
            }]  
        }  
        
        openDialog(TEMPLATE, data, opts)
    }
}

export default Discounts


/*
const discounts = {'discounts': [
    {'code': "puja2021",
     'name': "Puja Discount",
     'description': "there is happiness in the air. Hiraafood is celebrating <a href='http://google.com' target='_blank'>link</a> ",
     "starts_at": "Sep 01",
     "ends_at"  : "Nov 30",
     "checked" : "checked"
    },
    {'code': "diwali021",
     'name': "Diwali Discount",
     'description': "there is happiness in the air. Hiraafood is celebrating",
     "starts_at": "Sep 01",
     "ends_at"  : "Nov 30"
    }
]}

*/