import { Actor, Cast } from '@serenity-js/core';

import { ScenarioContext, UseScenarioContext } from 'serenity-scenario-context';
import { SupportDeskApi } from '../ticketing-system/index';
import { TestIdentificationContext } from './test-identification-context';
import { UseSupportDeskApi } from './use-support-desk-api';

export class SupportDeskCast implements Cast {
    private readonly scenarioContext = new ScenarioContext();

    public constructor() {
        this.scenarioContext.add(TestIdentificationContext.random());
    }

    prepare(actor: Actor): Actor {
        return actor.whoCan(
            UseScenarioContext.using(this.scenarioContext),
            UseSupportDeskApi.using(SupportDeskApi.instance()),
        );
    }
}
