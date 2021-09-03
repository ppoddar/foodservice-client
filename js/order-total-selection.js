// -----------------------------------------------------------------------
//      Filters on Order Total.
//
// -----------------------------------------------------------------------
class OrderTotalSelection {
    constructor($div) {
        if ($div) {
            this.render($div)
        }
    }

    render($div) {
        this.$view = $div
        $.get(template_name, (template) => {
            var data = {}
            var html = Mustache.render(template, data)
            $div.html(html)
        })   
    }

    getFilters() {
        var minimum = $e(this.$view, "#minimum").val()
        var maximum = $e(this.$view, "#maximum").val()
        return [`total__gte=${minimum}`, `total__lte=${maximum}`]
    }
}

export default OrderTotalSelection