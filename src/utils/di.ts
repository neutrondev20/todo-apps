import { Container as BrandiContainer } from "brandi";
import { RemoteMission, TOKENS as RemoteTokens } from "../data/remote/remote_mission";
import { RepositoryMissions, TOKENS as RepositoryTokens } from "../repository/repository_missions";
import { ModelMission, TOKENS as ModelTokens } from "../domain/models/models_missions";

export const container = new BrandiContainer();

container.bind(RemoteTokens.remoteMission)
    .toInstance(RemoteMission)
    .inSingletonScope()

container.bind(RepositoryTokens.repositoryMission)
    .toInstance(RepositoryMissions)
    .inSingletonScope()

container.bind(ModelTokens.modelsMission)
    .toInstance(ModelMission)
    .inSingletonScope()



