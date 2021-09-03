import Menu from "./menu.js";
import Discounts from './discounts.js'
import Recommendations from './recommendations.js'

const SERVER_URL = 'http://localhost:8000'

/**
 * Entry point to FoodService.
 * FoodService client provides the entire state of a FoodService server.
 * The static init() function fetches the entire state of the server (which
 * is small in memory). Though the server call via ajax is asynchronous, 
 * the init() method encompases the result in a resolved Promise, 
 */
class FoodService {
    /**
     * 
     * The entire state of a food service is small enough (~ 100KB) to
     * be loaded into memory.
     * They are initailzied from the server. And represented as in-memory
     * objects Menu, Discounts and Recommendations. 
     * These structires are populated in init method that returns a resolved Promise.
     */
    constructor() {
        this.menu = {}
        this.recommendations = {}
        this.discounts = {}
    }
    /**
     * A food service is initialized. FoodService employs a singleton pattern.
     * 
     * @returns a resolved promise 
     * @see ItemView.js 
     */
    static instance() {
        return new Promise((resolve, reject) =>{
            if (singleton) {
                console.log(`foodservice has alreay been initialized. returning singleton instance ...`)
                return resolve(singleton)
            } else {
                console.log(`creating and initailzing food service ...`)
                singleton = new FoodService()
                singleton.init()
                    .then((obj) => {
                        //console.log(`resolving promise ...`)
                        return resolve(obj)
                    }, (err)=>{
                        console.error(`error in Foodservice.init() ${err}`)
                        return reject
                    }
                )
            }
        }) 
    }

    init() {
        var url = `${SERVER_URL}/item/all`
        console.log(`initializing ${url} ...`)
        var _this = this;
        return new Promise((resolve, reject)=>{
            $.ajax({
                url: url,
                success: function(response, textStatus, xhr) {
                    if (xhr.status != 200) {
                        reject(textStatus)
                    }
                    console.log(`received server response ${JSON.stringify(response)}...`)
                    _this.menu = new Menu(response)
                    initRecommendation(_this.menu).then(() => {return;})
                    initDiscount().then(() => {return;})
                    
                    resolve(_this)
                }
            })
        })
        
        function initDiscount() {
            var url = `${SERVER_URL}/bill/discount/all`
            console.log(`initializing ${url} ...`)
            return new Promise((resolve, reject)=>{
                $.ajax({
                    url: url,
                    success: function(response, textStatus, xhr) {
                        if (xhr.status != 200) {
                            reject(textStatus)
                        }
                        _this.discounts = new Discounts(response.data)
                        resolve(_this)
                    }
                })
            })
        }

        function initRecommendation(ctx) {
            var url = `${SERVER_URL}/item/recommendation/all`
            console.log(`initializing ${url} ...`)
             return new Promise((resolve, reject) =>{
                $.ajax({
                    url: url,
                    success: function(response, textStatus, xhr) {
                        if (xhr.status != 200) {
                            reject(textStatus)
                        }
                        _this.recommendations = new Recommendations(response.data, ctx)
                        resolve(_this)
                    }
                })
            })
        }
    }

    toString() {
        return `foodservice`
    }
}
var singleton
export default FoodService

