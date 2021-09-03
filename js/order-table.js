class OrderTable {
    /**
     * Renders the given rows on a DataTable 
     * @param {*} rows 
     */
    render($div, rows) {
        var _this = this
        loadTemplate($div, 'templates/order-table.mustache', {'rows':rows}, function(){
            //console.log($div.html())
            console.log(`OrderTable render ${rows.length} rows. _this = ${_this}`)
            var opts = {
                "autoWidth":  true,
                "responsive": true,
                "select":     true,     
            
                "createdRow": function(row, data, dataIndex){
                    // console.log(`row=[${row}]`)
                    console.log(`created ${row} ${dataIndex} ${JSON.stringify(data)}`)
                    // console.log(`dataIndex=[${dataIndex}]`)
                    // data for a row is an array. the index on the array 
                    // 0:id
                    // 1: 
                    if (data['total'] > 15) {
                        $(row).css('color', 'green')
                    } else {
                        $(row).css('color', 'red')
                    }
                    // on post-callback to crete a row, data is assoicated with the row 
                    // via jquery.data('data') attribute. 
                    // This data will be retrieved when a row is selected
                    //$(row).data('data', data)
                },
                "columns": [
                    { "data": "id" },
                    { "data": "user" },
                    { "data": "total" },
                    { "data": "status" },
                    { "data": "created_at", "name":"when", 
                        "render": (data, type, row, meta ) => {
                            //console.log(`data=${data}`)
                            //console.log(`type=${type}`)
                            //console.log(`_this=${_this}`)
                            var t1 = new Date(Date.parse(data))
                            //console.log(`time=${t1} (type=${typeof(t1)})`)
                            var timeDelta = _this.computeTimeDifference();
                            var ago = _this.toHourMinuteSecond(timeDelta);
                            var time = `${t1.getHours()}:${t1.getMinutes()}`
                            return `${time} (${ago} ago)`
                        }}
                ]
            }

            $div.find('tbody').on('click', 'tr', function() {
                //alert(`row ${$(this)} selected`)
                //console.log(`selected ${JSON.stringify($(this))}`)
                var $row = $(this)
                var data = $row.data('data')
                console.log(`row ${$row.index()} selected data: ${JSON.stringify(data)}`)
            })

            if ($.fn.DataTable.isDataTable($div))  {
                console.log(`OrderTable clear`)
                $div.DataTable().clear().destroy()
            }
            $div.DataTable(opts)
        })
    }

    /**
     * 
     * @param {*} t1 
     * @param {*} t2 
     */
    computeTimeDifference(t1, t2) {
        return 60*100*1000
    }

    /**
     * given time in millisecnd.
     * @param {*} t time in millisecond
     * @return a string h hour m minute
     */
    toHourMinuteSecond(t) {
        var seconds = t/1000
        var minutes = seconds/60
        var hours = Math.floor(minutes/60)
        minutes = minutes - hours*60
        var str = ''
        if (hours > 0)   str += `${hours} h `
        str += `${minutes} m`
        return str
    }
}
export default OrderTable

/*

                
           
    
            
 
            */