class Recommendations {
    /**
     * an array of recommendations object
     * @param {*} an array of recommendation
     * @param {Menu} ctx a context to resolve the recommendations
     */
    constructor(data, ctx) {
        console.log(`initializing recommendations from ${data.length} records`)
        this.recos = {}
        for (var i = 0; i < data.length; i++) {
            var valid = true
            var reco = data[i]
            console.log(`resolving ${i}-th recommendation ${JSON.stringify(reco)}`)
            if (!ctx.findItemBySKU(reco.sku)) {
                console.error(`The ${i}-th tecommendation ${JSON.stringify(reco)} is invalid. The item with sku [${reco.sku}] not found. Ignoring...`)
                valid = false
                continue
            } else {
                for (var j = 0; j < others.length; j++) {
                    var o = reco.others[j]
                    if (!ctx.findItemBySKU(o)) {
                        valid = false
                        console.error(`The item for ${i}-th recommenation is invalid. The recommended ${j}-th item with sku ${o} not found. Ignoring...`)
                        break
                    }
                }
            }
            if (valid) this.recos[reco.sku] = reco
        }
    }

    /**
     * List of other items' SKU that are recommended with the item
     * with given sku.
     * can be empty.
     * @returns an array of SKU 
     */
     getRecommendation(sku) {
        // console.log(`getRecommendation(${sku}) in ${this.recommendations.length} `)
        var result = this.recos[sku]
        if (!result) return 
        var others = result.others
        if (!Array.isArray(others)) {
            others = others.split(' ')
        }
        return others
   }

}

export default Recommendations