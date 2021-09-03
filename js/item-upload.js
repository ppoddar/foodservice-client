class ItemUpload {
    open(cb) {
        var opts = {
            title: 'upload items',
            buttons: [{
                'text': 'Upload',
                'click': () => {
                    var payload = this.collect($(this))
                    console.log(JSON.stringify(payload))
                    $(".ui-dialog-titlebar-close").trigger('click');
                }
            }]
        }

        openDialog('templates/item-upload.mustache', {}, opts) 
    }
}

export default ItemUpload