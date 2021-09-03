const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
                     'July','Aug', 'Sep', 'Oct', 'Nov', 'Dec']
class DateRangeSelection {
    constructor($div) {
        this.GROUP_NAME = "order-date-choices"
       if ($div) this.render($div)
    }

    render($div) {
        this.$view = $div;
        var template_name = 'templates/order-date-selection.mustache'
        var today = new Date()
        var data = {
            "group": this.GROUP_NAME,
            "month": MONTH_NAMES[today.getMonth()],
            "day"  : today.getDate(),
            "year" : today.getFullYear(),
            "default-date": this.formatDate(),
            "date-format" : 'YYYY-MM-dd HH:mm'
        }
        $.get(template_name, function(template){
           var html = Mustache.render(template, data)
           $div.html(html)
       })    
    }

    /**
     * gets the filter(s).
     * @returns two filters to emulate BETWEEN syntax.
     */
    getFilters() {
        var selectedDateChoice = this.$view.find(`input[${this.GROUP}]:checked`)
            .first().attr('id')
        // Assumption: The template has two radio buttons with id: 'today' and 'custom'
        if (selectedDateChoice == 'today') {
            return this.getDefaultFilter()
        } else if (selectedDateChoice == 'custom') {
            var from = $e(this.$view, '#from').val()
            var to   = $e(this.$view, '#to').val()
            var filters = [`created_at__gte=${from}` , 
                           `created_at__lte=${to}`]
        }
        return filters
    } 
    
    /**
     * The default filter is for orders that are created today.
     * 
     * @returns two filters for orders created after today start (i.e. 00:00 hrs)
     * and before today ends (i.e. 23:59 hrs)
     */
    getDefaultFilter() {
        var today = new Date()
        var filters = [`created_at__gte=${this.formatDate(today, '00', '00')}` ,
                       `created_at__lte=${this.formatDate(today, '23', '59')}`]
        return filters
    }


    /**
     * Retunrs the given date in YYYY-MM-dd HH:mm format.
     * This is the format accepted by django backend for date based queries
     * 
     * The given date defaults to today 00:00 
     * 
     * @returns 
     */
    formatDate(d, hh, mm) {
        var d     = d || new Date()
        var year  = d.getFullYear()
        var month = d.getMonth()+1
        if (month < 10) month = '0'+month
        var day   = d.getDate()
        var hour   = hh || d.getHours()
        var minute = mm || d.getMinutes()

        return `${year}-${month}-${day} ${hour}:${minute}`
    }
}

export default DateRangeSelection