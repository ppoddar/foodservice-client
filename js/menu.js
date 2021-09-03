import {Categories} from "./categories.js";
import Category from "./category.js"
import Item     from "./item.js";

class Menu {
    constructor(items) {
        console.log(`initializing menu from ${items.length} items`)
        if (items) {
            this.items      = items
            this.categories = this.categorize(items)
        } else {
            throw `can not construct menu with undefiend items`
        }
    }
    /**
     * Gets the singleton menu.
     * 
     * Menu is initialized by fetching the items from server
     * via ajax (hence asynchronous), if necessary.
     * 
     * The callabck function is called once server response has been 
     * received.
     * @param {*} cb a callback function where this == this menu.
     * optional.
     */
    // static instance(cb) {
    //     if (singleton) {
    //         return singleton
    //     }
    //     console.log(`initilaizing menu from server...`)
    //     // IMPORTANT: all server urls must begin with '/' 
    //     $.ajax({
    //         url: `/item/all`,
    //         success: function(response) {
    //             if (response.status == 200) {
    //                 console.log(`received response from ajax with ${response['data'].length} items`)
    //                 singleton = new Menu()
    //                 singleton.init(response['data'])
    //                 singleton.getAllRecommendation()
    //                 cb.call(null, singleton)
    //             } else {
    //                 openErrorDialog('Initalization error', response.message)
    //             }
    //         },
    //         error: function (err) {
    //             console.log(err)
    //         }
    //     })
    // }

    // init(items) {
    //     this.items = items
    //     this.categories = this.categorize(this.items)
    // }

    /**
     * renders the entire menu.
     * Menu has two main sections. 
     * 1. A header bar that houses the category-wise
     * navigation and search button
     * 2. A list of items.
     * 
     * @param {HTMLDiveElement} $div a div with both the parts 
     */
    render($div) {
        this.renderCategories($e($div, '#menu-header'))
        this.renderItems($e($div, '#menu-items'))
        
    }

    renderCategories($div) {
        this.categories.buildCategoryOptions($div)
    }


    /**
     * renders all the menu items in given div.
     * The menu items are rendered in pre-defined, categoried order.
     * An item may be in multiple categories, but is not shown repeatedly
     * 
     * @param $div a conatainer element. The items rendered
     * will be added to the container.
     */
    renderItems($div) {
        var items = this.sortedItems()
        for (var i = 0; i < items.length; i++) {
            var item = items[i]
            item.render($div)
        }
    }
    /**
     * reorders the item in a fixed order of category 
     */
    sortedItems() {
        var shown = []
        var result = []
        for (var i = 0; i < Categories.ORDER.length; i++) {
            var category = this.categories.searchCategoryById(Categories.ORDER[i])
            if (category) {
                var items = category.items
                for (var j = 0; j < items.length; j++) {
                    var item = items[j]
                    if (shown.includes(item.sku)) continue
                    result.push(item)
                    shown.push(item.sku)
                }
            }
        }
        return result
    }

    /**
     * filters the items by category.
     * The list of items are sorted by category labels as appear in Categories.ORDER
     * An item may appear in multiple categories but an item appears only once
     * in the resultant array
     * 
     * @param {*} category_label a category label. null implies no filtering.
     * @returns an array of filtered items
     */
    filterByCategory(category_label) {
        var result     = []
        var candidates = []
        var selected   = []
        if (category_label) {
            var candidates = this.categories.getByLabel(category_label).items
            for (var i = 0; i < candidates.length; i++) {
                var item = candidates[i]
                if (selected.includes(item.sku)) continue;
                if (item.categories.includes(category_name)) {
                    result.push(item)
                    selected.push(item.sku)
                }
            }
            return result
        } else {
            for (var j = 0; j < Categories.ORDER.length; j++) {
                var candidates = this.categories.getById(Categories.ORDER[i]).items
                for (var i = 0; i < candidates.length; i++) {
                    var item = candidates[i]
                    if (selected.includes(item.sku)) continue;
                    result.push(item)
                    selected.push(item.sku)
                }
            }
        }
        return result
    }

    /**
     * 
     * @param Categorize the given items
     * @returns a map of category name -> Category
     */
    categorize(items) {
        var categories = new Categories() 
        for (var i = 0; i < items.length; i++) {
            let item = new Item(items[i])
            //console.log(`${item} in categories ${item.categories}` )
            // an item may have multiple category ids
            for (var j = 0; j < item.categories.length; j++) {
                let cid = item.categories[j]
                var category = categories.addCategory(cid)
                category.addItem(item)
            }
        }
        return categories
    }

    /**
     * Finds item by given sku.
     * @param {string} sku 
     * @returns an Item object
     * @raises Exception if no item with given SKU exists in this menu
     */
    findItemBySKU(sku) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].sku == sku) return new Item(this.items[i])
        }
        //throw `no item found with sku ${sku} in this menu of ${this.items.length} items`
    }

   
/*
 * selects items of given category and renders the items on $menu-items element
 */    
 selectByCategory(category) {
    //console.log(`onCategorySelect ${category}`)
    var $menuItems = $('#menu-items')
    $menuItems.empty()
    this.filterByCategory(category)
        .forEach(function(item) {
        item.render($menuItems)
    })
}

}
//var singleton

export default Menu