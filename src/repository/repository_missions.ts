import { IMission } from "../interface/interface_missions";
import { IRemoteMission, TOKENS as RemoteTokens } from "../data/remote/remote_mission";
import { injected, token } from "brandi";

export abstract class IRepositoryMissions<T> {

    abstract get() : Promise<T[]>
}

export class RepositoryMissions implements IRepositoryMissions<IMission> {

    remote : IRemoteMission<IMission>

    constructor(remote : IRemoteMission<IMission>){

        this.remote = remote;
    }

    async get(): Promise<IMission[]> {
        
        return await this.remote.get();
    }
}

export const TOKENS = {
    
    repositoryMission : token<IRepositoryMissions<IMission>>("Repository Mission")
}

injected(RepositoryMissions, RemoteTokens.remoteMission)

