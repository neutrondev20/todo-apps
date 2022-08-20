import Dexie, {Table}  from 'dexie';
import {token} from "brandi";
import { IMission } from './../../interface/interface_missions';

export abstract class ALocalMIssion<T> extends Dexie {

    abstract get() : Promise<T[]>

    abstract create(item : any) : Promise<void>

    abstract del(index : string | number) : Promise<void>
}

export class LocalMission extends Dexie implements ALocalMIssion<IMission> {

    mission! : Table<IMission>

    constructor(){

        super("localDB");

        this.version(1).stores({
            mission : 'id, text, condition, show, createAt, updateAt'
        })
    }

    async get() : Promise<IMission[]> {
        
        return (await this.mission.toArray()) || []
    }

    async create(item : IMission) : Promise<void> {

        this.mission.add(item);
    }

    async del(index : string | number) : Promise<void> {

        this.mission.where("id").equals(index).delete()
    }
}

export const TOKENS = {

    localMission : token<ALocalMIssion<IMission>>("Local Mission")
}

