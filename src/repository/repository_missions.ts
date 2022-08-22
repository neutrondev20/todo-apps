import { injected, token } from "brandi";
import { IMission, IRequestMission } from "../interface/interface_missions";
import { ARemoteMission, TOKENS as RemoteTokens } from "../data/remote/remote_mission";
import { ALocalMIssion, TOKENS as LocalTokens } from "../data/local/local_missions";

export abstract class ARepositoryMissions<T> {

    abstract get() : Promise<T>

    abstract create(item : any) : Promise<T>

    abstract delete(index : string | number) : Promise<T>
}

export class RepositoryMissions implements ARepositoryMissions<IRequestMission> {

    remote : ARemoteMission<IRequestMission>
    local  : ALocalMIssion<IMission>

    constructor(remote : ARemoteMission<IRequestMission>, local : ALocalMIssion<IMission>){

        this.remote = remote;
        this.local = local;
    }

    async get(): Promise<IRequestMission> {

        const response = await this.remote.get();

        if (response.status === "ERROR")
            return {
                ...response,
                data : await this.local.get()
            }
        else
            return response
         
    }

    async create(item : IMission) : Promise<IRequestMission>{

        await this.local.create(item)

        return await this.remote.create(item);
    }

    async update(){


    }

    async delete(index : string | number) : Promise<IRequestMission>{

        await this.local.del(index)

        return await this.remote.delete(index)
        
    }
}

export const TOKENS = {

    repositoryMission : token<ARemoteMission<IRequestMission>>("Repository Mission")
}

injected(RepositoryMissions, RemoteTokens.remoteMission, LocalTokens.localMission)

