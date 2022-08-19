
export interface ModelsMission {
    id        : number,
    text      : string,
    condition : boolean,
    show      : boolean,
    createAt  : Date,
    updateAt  : Date
}

export class Mission implements ModelsMission {
    
    id        : number
    text      : string
    condition : boolean
    show      : boolean
    createAt  : Date
    updateAt  : Date

    constructor(item : ModelsMission) {
        this.id        = item.id
        this.text      = item.text
        this.condition = item.condition
        this.show      = item.show
        this.createAt  = item.createAt,
        this.updateAt  = item.updateAt
    }

}