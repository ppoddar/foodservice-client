/**
 * A view controller to create a new menu item
 */

import {Categories} from "./categories.js";
import Category from "./category.js";

 class ItemCreate {
     /**
      * Opens a dialog to create an item.
      * 
      * @param {*} cb an optional callback function. Called after 'OK' button
      * has performed its action.
      */
    open(cb) {
        var _this = this
        var opts = {
            autoOpen: true,
            title: 'Create new Item',
            width: '50em',
            buttons:[
                {'text': 'create',
                 'click': function() {
                    if (_this.validate($(this))) {
                        var payload = _this.collect($(this))
                        _this.sendCreateItemRequest(payload, cb)
                    }
                 }
                }
            ],
            close: function() {
                $(".ui-dialog-titlebar-close").trigger('click');
            }}
        // the template shows choices for categories     
        var data = {'category-choices': Categories.PRE_DEFINED_CATEGORIES}
        
        openDialog('templates/item-create.mustache', data, opts)
    }

    validate($form) {
        var sku = $e($form, '#item-sku').val().trim()
        if (!sku) {
            show_error($form, 'must fill up a SKU')
            return false
        }
        let re = /^[a-zA-Z][\\w\\d\\-_]*$/
        if (!re.test(sku)) {
            show_error($form, `invalid sku ${sku}. 1. Must begin with a letter 2. Must contain letter, digit, hypehen(-) or underscore(_) only`)
            return false
        }
    }

    collect() {
        var sku = $e($form, '#item-sku').val().trim()
        return {'sku':sku}

    }
    sendItemCreateRequest(payload, cb) {
        var url = ''
        var _this = this
        $.ajax({
            url: url,
            method:'POST',
            data: JSON.stringify(payload),
            contentType: 'application/json',
            success: function(response) {
                var status = response['status']
                if (status == 200) {
                    openInfoDialog(response['message'])
                } else if (status == 301) {
                    new LoginDialog().open(function(){
                        _this.sendItemCreateRequest(payload, cb)
                    })
                } else {
                    openWarningDialog(response['message'])
                }
            }
        })
    }
}
function show_error($div, message) {
    var $error = $e($div,'#error')
    console.error(message)
    $e($error, "#message").html(message) 
    $error.removeClass("w3-hide")
    //$div.effect("shake", { times: 5 }, 100);
}
export default ItemCreate