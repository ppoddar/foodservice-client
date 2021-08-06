/**
 * gets a value for given dictionary with a possible default
 * @param {*} dict 
 * @param {*} key 
 * @param {*} def 
 * @returns 
 */
 function fromDict(dict, key, def) {
    if (key in dict) {
        return dict[key]
    } else if (def) {
        return def
    } else {
        throw `[${key} is missing from given dictionary. available keys are [${Object.keys(dict)}]`
    }
}

/**
 * Opens a dialog with a message. The dialog has no buttons except a close
 * button at the top-right corner
 * 
 * @param {title} dialog title
 * @param {message} dialog message
 * @param {fn} cb the callback, if any, will be called when the dialog is closed
 */
function openWarningDialog(title,message,cb) {
    var opts = {
        autoOpen: true,
        modal:true,
        width: 300,
        height: 300,
        'title'  : title || 'Warning',
        'close': ()=>{
            $(this).closest('.ui-dialog-content').dialog('close')
            if (cb) cb.call(null)
        }
    }
    openDialog('templates/warning.mustache', 
        {'message': message || ''}, opts)
}

/**
 * Opens a dialog with a message. The dialog has no buttons except a close
 * button at the top-right corner
 * 
 * @param {title} dialog title
 * @param {message} dialog message
 * @param {fn} cb the callback, if any, will be called when the dialog is closed
 */
 function openErrorDialog(title,message,cb) {
    var opts = {
        autoOpen: true,
        modal:true,
        width: 300,
        height: 150,
        'title'  : title || 'Error',
        'close': ()=>{
            $(this).closest('.ui-dialog-content').dialog('close')
            if (cb) cb.call(null)
            // restart for beginning
            window.location = 'index.html'
        }
    }
    openDialog('templates/error.mustache', 
        {'message': message || ''}, opts)
}




/**
 * Opens a dialog
 * @param {*} template_file 
 * @param {*} data 
 * @param {Dictornary} opts has all the options to configure a dialog
 * including buttons that contols the OK/Cancel button 
 */
function openDialog(template_file, data, opts) {
    $.get(template_file, function(template){
        opts = opts || {}
        data['description'] = ''
        var html = Mustache.render(template, data)
        var $dialog = $('<div>')
        $dialog.html(html)
        var w = opts['width']   || 600
        var h = opts['height']  || 500
        $dialog.dialog({
            autoOpen : opts['autoOpen']  || true,
            modal    : opts['modal']     || true,
            minWidth : w, 
            minHeight: h,
            title    : opts['title']   || '',
            buttons  : opts['buttons'] || [],
            open     : opts['open']    || {},
            close    : opts['close']   || {}
        })

    })
}

/**
 * loads a template.
 * applies the loaded template on given data to create HTML
 * sets HTML to given $div 
 * callback the given function
 * @param {HTMLDivElement} $div existing element //TODO; can it be new?
 * @param {String} template_name name of template file in the server
 * @param {dictionary} data optional dictionary to apply to the template
 * @param cb an optional function wil be called with no argument
 */
function loadTemplate($div, template_name, data, cb) {
    $.get(template_name, function(template) {
        var html = Mustache.render(template, data || {})
        $div.html(html)
        //console.log(`loadTemplate() ${template_name} callback ${cb}`)
        if (typeof cb === 'function') {
            cb.call(null)
        }
    })
}


/**
 * Raises if any of the given keys are missing in the given dictionary
 * @param {Dictionary} dict a dictionary
 * @param {String[]} keys array of strings
 */
 function assertKeys(dict, keys, checkValue) {
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i]
        if (key in dict) {
            if (checkValue == true) {
                var value = dict[key]
                console.log(`checking ${key} == [${value}]`)
                if (value == undefined || value == null || value.trim() == '') {
                    throw `key [${key}] has no value`
                }
            }
            continue
        } 
        else throw `missing key [${key}]. Available keys are [${Object.keys(dict).sort()}]`
    }
}

/**
     * converts to base 64
     * @param str the string to covert tp base 64
     * @returns a base 64 string
     */
 function utf8_to_b64( str ) {
    return window.btoa(unescape(encodeURIComponent( str )));
  }
  
/**
 * converts to utf
 * @param str the base 64 string to covert tp utf
 * @returns a utf string
 */
 function b64_to_utf8( str ) {
    return decodeURIComponent(escape(window.atob( str )));
}

function $e($div, selector) {
    var $element = $div.find(selector)
    if ($element.length == 0) {
        var suggest = (selector.startsWqith('#')) ? '' : 'did you forget #?'
        throw `element by [${selector}] not found in div [${$div.attr('id')}]. ${suggest}`
    }
    return $element
}