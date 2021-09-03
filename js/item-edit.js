import {PRE_DEFINED_CATEGORIES} from "./categories.js"

/**
 * A view controller to edit an existing menu item
 */
class ItemEdit {
    open(item, $div) {
        //console.log(`ItemView.open() argument type ${typeof(item)}`)
        //console.log(`edit button clicked [${JSON.stringify(item, null, 2)}]`)
        var _this = this
        var opts = {
            autoOpen: true,
            modal: true,
            width: 500,
            title : `Edit item ${item.sku}`,
            buttons:[
                {'text': 'update item',
                 'click': function() {
                     var $form = $(this)
                     if (_this.validate($form)) {
                        var payload = _this.collect($form)
                        _this.sendItemUpdateRequest(payload)
                        $(this).dialog('destroy')
                     }
                 }
                }
            ]
        }
        var data = item.toDict()
        data['category-choices'] = PRE_DEFINED_CATEGORIES
        console.log(`${data['category-choices']}`)
        openDialog('templates/item-edit.mustache', data, opts)

    }

    validate($form) {
        var sku        = $form.find('#item-sku').text()
        var name       = $form.find('#item-name').val()
        var short_name = $form.find('#item-short-name').val()
        var price      =  Number($form.find('#item-price').val())
        var half_price = Number($form.find('#item-half-price').val())
        return true
    }

    collect($form) {
        //console.log(`collect ${$form.html()}`)
        return {
            sku : $form.find('#item-sku').text(),
            name : $form.find('#item-name').val(),
            short_name : $form.find('#item-short-name').val(),
            price :      Number($form.find('#item-price').val()),
            half_price : Number($form.find('#item-half-price').val()),
        }
    }

    sendItemUpdateRequest(payload) {
        console.log(`sendItemUpdateRequest payload ${JSON.stringify(payload, null, 2)}`)
        $.ajax({
            url : `${SERVER_URL}/item/update`,
            method: 'POST',
            data: JSON.stringify(payload),
            contentType: 'application/json',
            success: function(response) {
                var status = response['status']
                if (status == 301) {

                } else if (status == 200) {

                } else {

                }
            }

        })
    }
}
export default ItemEdit