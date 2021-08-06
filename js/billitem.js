
class BillItem {
    constructor(data) {
        this.id     = data['id']
        this.kind   = data['kind']
        this.name   = data['name']
        this.amount = Number(data['amount']).toFixed(2)
        console.log(`created BillItem ${JSON.stringify(this)}`)
    }

    
}

export default BillItem