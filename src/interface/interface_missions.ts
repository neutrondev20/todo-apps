export interface IMission {
    id        : number,
    text      : string,
    condition : boolean,
    show      : boolean,
    createAt  : Date,
    updateAt  : Date
}

export interface IRequestMission {
    status  : string,
    message : string,
    data    : IMission[] | null
}