import Cart from "./cart.js"

class EditLineitemDialog {
    open(li) {
        console.log(`open ${this.constructor.name} for item [${li}]`)
        var opts = {
            autoOpen : true,
            modal: true,
            with: 300, height:200,
            title: 'Change quantity',
            buttons: [
                {
                    'text': 'update',
                    'click': function() {
                        var q = $(this).find('#quantity').val()
                        console.log(`update quantity to ${q}`)
                        Cart.instance().changeQuantity(li.sku, q)
                        $(this).closest('.ui-dialog-content').dialog('close')
                    }
                }
            ]
        }
        openDialog('templates/lineitem-edit.mustache', {
            'name': li.name,
            'quantity': li.quantity
        }, opts)

    }
}

export default EditLineitemDialog