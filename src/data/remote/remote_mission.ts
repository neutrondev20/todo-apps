import { token } from 'brandi';
import { IMission } from './../../interface/interface_missions';
import { RequestBuilder } from '../../utils/use_fetch';


export abstract class IRemoteMission<T> {
    abstract get() : Promise<T[]>
}

export class RemoteMission implements IRemoteMission<IMission> {

    client: RequestBuilder = new RequestBuilder;

    async get() : Promise<IMission[]> {

        const url = "http://localhost:5001/missions"

        const { data, error } = await this.client.get(url)

        if (error?.response?.status === 401) {
            // TODO unauthorized handler
            // throw new UnauthorizedException
        }

        return data;
    }
}

export const TOKENS = {

    remoteMission : token<IRemoteMission<IMission>>("Remote Mission")
}