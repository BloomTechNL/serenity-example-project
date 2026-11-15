import { Ability, AbilityType, Interaction, LogicError } from '@serenity-js/core';

type InteractingActor = Parameters<Parameters<typeof Interaction.where>[1]>[0];

export interface AbilityCase {
    matches(actor: InteractingActor): boolean;
    perform(actor: InteractingActor): void;
}

/**
 * One branch of an {@link interactionByAbility}: run `perform` when the actor
 * has the given ability. The ability is passed along so the branch doesn't
 * need to look it up again.
 */
export const whenAbleTo = <A extends Ability>(
    abilityType: AbilityType<A>,
    perform: (actor: InteractingActor, ability: A) => void,
): AbilityCase => ({
    matches: actor => actor.hasAbilityTo(abilityType),
    perform: actor => perform(actor, abilityType.as(actor)),
});

/**
 * Like `Interaction.where`, but chooses what to execute based on the abilities
 * of the actor. The first case whose ability the actor has is performed; if the
 * actor has none of them, the interaction fails.
 *
 * @example
 *  const openTicket = () =>
 *      interactionByAbility('#actor opens a ticket',
 *          whenAbleTo(UseSupportDeskApi, (actor, api) => api.post('/tickets')),
 *          whenAbleTo(BrowseTheWeb, (actor, browser) => browser.open('/tickets/new')),
 *      );
 */
export const interactionByAbility = (description: string, ...cases: AbilityCase[]) =>
    Interaction.where(description, actor => {
        const chosen = cases.find(candidate => candidate.matches(actor));

        if (!chosen) {
            throw new LogicError(`${ actor.name } has none of the abilities needed to perform: ${ description }`);
        }

        chosen.perform(actor);
    });
