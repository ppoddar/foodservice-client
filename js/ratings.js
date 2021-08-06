const MAX_RATING = 5
const ICON_CLASS = 'material-icons'
const FILLED = '#FFD700'
const ICON = 'star_rate'

class Ratings {
    constructor(r) {
        this.value = r
    }
    /**
     * generates a div with filled and unfilled material-icons 
     * @param {*} value number of filled icons 
     * @returns a span of an array of material-icons 
     */
    render() {
        var $result = $('<span>')
        for (var i = 0; i < this.value; i++) {
            var $el = $('<span>')
            $el.addClass(ICON_CLASS)
            $el.css('color', FILLED)
            $el.text(ICON)
            $result.append($el)
        }
        return $result
    }
}
export default Ratings