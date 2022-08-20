import { defineStore } from "pinia";
import { Mission } from "../types/mission_type";

const useStoreMissions = defineStore("store-missions", {
    state : () => ({
        missionItems : [] as Mission[]
    }),
    actions : {
        initialize() {
            // TODO
            // Get data from repository
            this.missionItems = []
        },
        addMission(mission : Mission) {

            this.missionItems.push(mission);
        },
        updateMission(index : number, mission : Mission) {

            this.missionItems[index] = {
                ...mission
            };
        },
        deleteMission(index : number) {

            this.missionItems.splice(index, 1)
        }
    },
    getters : {
        get() : Mission[]  {

            return this.missionItems
        }
    } 
})

export default useStoreMissions;