import { IMission } from "../../interface/interface_missions";

export class Mission implements IMission {
    
    id        : number
    text      : string
    condition : boolean
    show      : boolean
    createAt  : Date
    updateAt  : Date

    constructor(item : IMission) {
        this.id        = item.id
        this.text      = item.text
        this.condition = item.condition
        this.show      = item.show
        this.createAt  = item.createAt,
        this.updateAt  = item.updateAt
    }

    
}