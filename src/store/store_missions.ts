import { defineStore } from "pinia";
import {TOKENS as ModelTokens} from "../domain/models/models_missions";
import { TMission } from "../types/mission_type";
import {container} from "../utils/di";

const model = container.get(ModelTokens.modelsMission);

const useStoreMissions = defineStore("store-missions", {
    state : () => ({
        missionItems : [] as TMission[],
        isLoading : false,
    }),
    actions : {
        async initialize() {
            try {

            this.isLoading = true;
            
            const data = await model.get();
            
            this.missionItems = data;

            } finally {

                this.isLoading = false;
            }
        },
        async addMission(mission : TMission) {

            this.missionItems.push(mission);

            await model.create(mission)
        },
        updateMission(index : number, mission : TMission) {

            this.missionItems[index] = {...mission};
        },
        deleteMission(index : number) {

            this.missionItems.splice(index, 1)

            model.delete(index)
        }
    },
    getters : {
        get() : TMission[]  {

            return this.missionItems
        }
    } 
})

export default useStoreMissions;