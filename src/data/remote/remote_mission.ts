import { token } from 'brandi';
import { IRequestMission } from './../../interface/interface_missions';
import { RequestBuilder } from '../../utils/use_fetch';

const url = "http://localhost:5001/missions"

export abstract class ARemoteMission<T> {

    abstract get() : Promise<T>

    abstract create(item : any) : Promise<T>

    abstract delete(index : string | number) : Promise<T>
}

export class RemoteMission implements ARemoteMission<IRequestMission> {

    client: RequestBuilder = new RequestBuilder();

    async get() : Promise<IRequestMission> {

        const { data, error } = await this.client.get(url);

    
        if (error) {

            console.log(error);

            return {
                status : "ERROR",
                message : "Internal server error",
                data : []
            }
            
        }
            
        return data;
    }

    async create(item : IRequestMission) {
        
        const { data, error } = await this.client.post(url, item);

        if (error)
            console.log(error);

        return data;
    }

    async delete(index : string | number) {

        const { data, error } = await this.client.delete(`${url}/${index}`);

        if (error) {

            console.log(error);

            return {
                status : "ERROR",
                message : "Internal server error",
                data : []
            }
            
        }

        return data;
    }
}

export const TOKENS = {

    remoteMission : token<ARemoteMission<IRequestMission>>("Remote Mission")
}