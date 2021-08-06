class Quantity {
    constructor(value) {
        this.value = value
    }
    render($div) {
        /*
        var $increment = $div.siblings('#increment-button>').first()
        var $decrement = $div.siblings('#decrement-button>').first()
        var $value     = $div.siblings('#quantity>').first()
        $value.val(this.value.toString())
        $increment.on('click', function(e){
            var value = parseInt($value.val())
            $value.attr('value', (value+1).toString())
            $decrement.prop('disabled', value < 1)
            return false

        })
        $decrement.on('click', function(e){
            var value = parseInt($value.val())
            if (value > 1) {
                $value.attr('value', (value-1).toString())
            }
            $decrement.prop('disabled', value <= 1)
            return false
        })
        */
    }

}
export default Quantity