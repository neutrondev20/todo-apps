type Mission = {
    id : number,
    text : string,
    condition : boolean,
    show : boolean
}

export const addTask = (
    input : string,
    missions : Mission[]
) : void => {

    missions.push({
        id : missions.length,
        text : input,
        condition : true,
        show : true
    })
}

export const updateTask = (missions : Mission, input : string) : void => {

    missions.text = input;
}