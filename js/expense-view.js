const SERVER_URL = 'http://localhost:8000'

class ExpenseView {

    open($div) {
        var _this = this
        var url = `${SERVER_URL}/expense/all`
        $.ajax({
            url: url,
            success: function(response) {
                _this.render($div, response.data)
            }
        })
    }
    render($div, expenses) {
        loadTemplate($div, 'templates/expense-view.mustache', {'items':expenses}, ()=>{
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
                    {'data': 'date'},
                    {'data': 'name'},
                    {'data': 'amount'},
                    {'data': 'user',    'visible':false},
                    {'data': 'comment', 'visible':false}
                ]
            }
            
            $div.DataTable(opts)

            // $div.find('tbody').on('dblclick', 'tr', function() {
            //     var $row = $(this)
            //     var expense = $row.data('data')
            //     console.log(`row ${$row.index()} selected data: ${JSON.stringify(expense)}`)

            //     new DiscountEdit().open(discount)
            // })

        })
    }

}
export default ExpenseView