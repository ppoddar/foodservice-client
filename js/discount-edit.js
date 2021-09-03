import AdminLoginPage from "./admin-login-page.js"

const SERVER_URL = 'http://localhost:8000'
class DiscountEdit {
    open(discount) {
        var _this = this
        var opts = {
            autoOpen: false,
            title: 'Edit discount',
            height: '16em',
            buttons:[
                {'text': 'update',
                 'click': function() {
                    //console.log(`clicked ${$(this).text()} tag=${$(this).prop('tagName')}`)
                    if (_this.validate($(this))) {
                        var payload = _this.collectInput($(this))
                        payload['code'] = discount['code']
                        _this.sendUpdateDiscountRequest(payload)
                    }
                 }
                }
            ],
            close: function() {
                console.error('close discount edit dialog')
                //$(this).closest('.ui-dialog-content').hide()
                $(".ui-dialog-titlebar-close").trigger('click');
            }}

        openDialog('templates/discount-edit.mustache', discount, opts)
    }

    validate($div) {
        var name  = $e($div, '#name').val()
        var start = $e($div, '#starts_at').val()
        var end   = $e($div, '#ends_at').val()
        //var desc  = $e($div, '#description').val()
        if (!name) {
            this.showError(`discount name must not be empty`)
            return false
        }
        if (Date.parse(start) > Date.parse(end)) {
            this.show_error($div, `discount start date ${start} must be before end date ${end} `)
            return false
        }
        return true
    }

    collectInput($div) {
        var name  = $e($div, '#name').val()
        var start = $e($div, '#starts_at').val()
        var end   = $e($div, '#ends_at').val()
        var desc  = $e($div, '#description').val()

        return {
            "name": name,
            "starts_at": start, "ends_at": end,
            "description": desc
        }
    }
    sendUpdateDiscountRequest(payload) {
        //console.log(`will send request with payload ${JSON.stringify(payload)}`)
        var url = `${SERVER_URL}/billing/update/discount`
        var _this = this
        $.ajax({
            url: url,
            method:'PUT',
            data: JSON.stringify(payload),
            contentType: 'application/json',
            success: function(response) {
                var status = response['status']
                if (status == 301) {
                    console.error(`${response['message']}`)
                    new AdminLoginPage().open(
                    function(){ // execute if login is successful
                        _this.sendUpdateDiscountRequest(payload)
                    })
                } else {
                    console.log('discount updated')
                }
            }
        })

    }

    show_error($div, message) {
        var $error = $e($div,'#error')
        console.error(message)
        $e($error, "#message").html(message) 
        $error.removeClass("w3-hide")
        //$div.effect("shake", { times: 5 }, 100);
    }
}

export default DiscountEdit