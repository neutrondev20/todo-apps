import { injected, token } from 'brandi';
import { IMission, IRequestMission } from "../../interface/interface_missions";
import { ARepositoryMissions, TOKENS as RepositoryTokens } from "../../repository/repository_missions";
import { TMission } from './../../types/mission_type';

export abstract class AModelMission<T> {

    abstract get() : Promise<T[]>

    abstract create(item : TMission) : Promise<void>

    abstract delete(index : string | number) : Promise<void>
}

export class ModelMission implements AModelMission<TMission> {
    
    repository : ARepositoryMissions<IRequestMission>
    
    constructor(repository : ARepositoryMissions<IRequestMission>){

        this.repository = repository;
    }

    async get() : Promise<IMission[]> {

        const result = await this.repository.get();

        return result.data || [];
    }

    async create(item : TMission) : Promise<void> {

        const data = {
            ...item,
            createAt : new Date(),
            updateAt : new Date()
        }

        await this.repository.create(data)
    }

    async delete(index : string | number) :Promise<void> {

        await this.repository.delete(index);
    }

}

export const TOKENS = {
    
    modelsMission : token<AModelMission<TMission>>("Model mission")
}

injected(ModelMission, RepositoryTokens.repositoryMission);
