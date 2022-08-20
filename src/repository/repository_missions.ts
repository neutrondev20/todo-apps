import { injected, token } from "brandi";
import { IMission, IRequestMission } from "../interface/interface_missions";
import { ARemoteMission, TOKENS as RemoteTokens } from "../data/remote/remote_mission";

export abstract class ARepositoryMissions<T> {

    abstract get() : Promise<T>

    abstract create(item : any) : Promise<T>

    abstract delete(index : string | number) : Promise<T>
}

export class RepositoryMissions implements ARepositoryMissions<IRequestMission> {

    remote : ARemoteMission<IRequestMission>

    constructor(remote : ARemoteMission<IRequestMission>){

        this.remote = remote;
    }

    async get(): Promise<IRequestMission> {
        
        return await this.remote.get();
    }

    async create(item : IMission) : Promise<IRequestMission>{

        return await this.remote.create(item);
    }

    async update(){


    }

    async delete(index : string | number){

        return await this.remote.delete(index)
    }
}

export const TOKENS = {

    repositoryMission : token<ARemoteMission<IRequestMission>>("Repository Mission")
}

injected(RepositoryMissions, RemoteTokens.remoteMission)

