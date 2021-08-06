var DELIVERY_TIME_GROUP = 'delivery_time'
var DEFAULT_DELIVERY_TIME_CHOICE = 'delivery-time-default'
var DEFAULT_DELIVERY_TIME_LABEL  = 'delivery-time-default-label'
var CUSTOM_DELIVERY_TIME_CHOICE  = 'delivery-time-custom'
var DATETIMEPICKER_ID = "timepicker"
var MINUTE_IN_MS = 1000*60
var FOOD_PREPARATION_TIME_IN_MINUTES = 30

class DeliveryTime {
    constructor() {
        this.delivery_delay = FOOD_PREPARATION_TIME_IN_MINUTES
    }
    render($div) {
        var _this = this
        loadTemplate($div, 'templates/delivery-time.mustache', 
            {'group':DELIVERY_TIME_GROUP, 
            'delivery_delay': `(${FOOD_PREPARATION_TIME_IN_MINUTES} minutes)`},
        function() {
            _this.$timepicker = $div.find('#'+DATETIMEPICKER_ID)
            var now = new Date()
            var delivery_time = _this.after(now, FOOD_PREPARATION_TIME_IN_MINUTES*MINUTE_IN_MS)
            var delivery_time_string = _this.timeString(delivery_time)
            console.log(`delivery_time=[${delivery_time_string}]`)
            $e($div, '#' + DEFAULT_DELIVERY_TIME_LABEL).first().text(delivery_time_string)
            $.datetimepicker.setLocale('en');
            _this.$timepicker.datetimepicker({
                datepicker:false,
                format:'H:i',
                minTime: delivery_time_string
            });
            
        })
    }
    getDeliveryTime() {
        var selector = `input[name=${DELIVERY_TIME_GROUP}]:checked`
        var id = $(selector).first().attr('id')
        var result = ''
        if (id == DEFAULT_DELIVERY_TIME_CHOICE) {
            var $label = $('#' + DEFAULT_DELIVERY_TIME_LABEL).first()
            result = $label.text()
        } else if (id == CUSTOM_DELIVERY_TIME_CHOICE) {
            result = this.$timepicker.val()
        } else {
            console.log(`WARN:unknown id [${id}] of selected element`)
        }
        console.log(`time:${result}`)
        return result
    }

    /**
     * gets time as a string
     * @param {Date} time 
     */
     timeString(time) {
        return `${time.getHours()}:${time.getMinutes()}`
    }
    /**
     * Gets time after given time by given delay
     * @param {Date} time 
     * @param {int} delay 
     */
    after(time, delay) {
        var now = new Date()
        var diff = 60
        var delivery_time = new Date(now.getTime() + diff*60000);
        return delivery_time
    }
}

export default DeliveryTime


/**
 * <input type='radio' id='delivery-time-now' checked name='delivery-time'>
    <label for='delivery-time-now'>as early as possible</label>
    <br>
 * <input type='radio' id='delivery-time-custom' name='delivery-time'>
    <label for='delivery-time-custom'>at</label>
createRadio(id, checked) {
        var $radio = $('<input>')
        $radio.attr('type', 'radio')
        $radio.attr('name', DELIVERY_TIME_GROUP)
        $radio.attr('id', id)
        if (checked) $radio.attr('checked', true)
    }

    createDefaultChoice($choices) {
        var $label = $('<label>')
        $label.attr('for', DEFAULT_DELIVERY_TIME_OPTION)
        $label.text(DEFAULT_DELIVERY_TIME_LABEL)
        $choices.append([this.default, $label, '<br>'])
    }
    
    // set the control for curom delivery time
    // it is set such that user can not select time in past
    createCustomChoice($choices, $customDeliveryTime) {
        var $label = $('<label>')
        $label.attr('for', CUSTOM_DELIVERY_TIME_OPTION)
        var now = new Date()
        var delivery_time = this.after(now, FOOD_PREPARATION_TIME_IN_MINUTES*MINUTE_IN_MS)
        var delivery_time_string = this.timeString(delivery_time)
        $.datetimepicker.setLocale('en');
        var $customDeliveryTime = $('<input>')
        $customDeliveryTime.attr('placeholder', 'pick a time')
        $customDeliveryTime.attr('disabled',    true)      
        $customDeliveryTime.datetimepicker({
            datepicker:false,
            format:'H:i',
            minTime: delivery_time_string
        });
        $customDeliveryTime.val(delivery_time_string)
        $label.append(['<span> at </span>', $customDeliveryTime])
        $choices.append([this.custom, $label, '<br>'])
    }

 */