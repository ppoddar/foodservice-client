const SERVER_URL = 'http://localhost:8000'

import DiscountEdit from "./discount-edit.js"
class DiscountView {

    open($div) {
        var _this = this
        var url = `${SERVER_URL}/bill/get/discounts`
        $.ajax({
            url: url,
            success: function(response) {
                _this.render($div, response.data)
            }
        })
        
    }
    render($div, discounts) {
        loadTemplate($div, 'templates/discount-view.mustache', {'discounts':discounts}, ()=>{
            var opts = {
                "autoWidth":  true,
                "responsive": true,
                "select":     true, 
                "fixedHeader": true,
                "fixedFooter": true,
                "dom"        : '<f<t>i>',
                "createdRow": function(row, data, dataIndex) {
                    console.log(`data at createRow ${JSON.stringify(data)}`)
                    $(row).data('data', data)
                },
                columns:[
                    {'data': 'code'},
                    {'data': 'name'},
                    {'data': 'starts_at'},
                    {'data': 'ends_at'},
                    {'description': 'description', 'visible':false}
                ]
            }
            
            $div.DataTable(opts)

            $div.find('tbody').on('dblclick', 'tr', function() {
                //alert(`row ${$(this)} selected`)
                //console.log(`selected ${JSON.stringify($(this))}`)
                var $row = $(this)
                var discount = $row.data('data')
                console.log(`row ${$row.index()} selected data: ${JSON.stringify(discount)}`)

                new DiscountEdit().open(discount)
            })

        })
    }

}
export default DiscountView