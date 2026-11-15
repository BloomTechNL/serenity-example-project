import { Ability, AbilityType, Interaction, LogicError } from '@serenity-js/core';

type InteractingActor = Parameters<Parameters<typeof Interaction.where>[1]>[0];

/**
 * An ability paired with what to do when the actor has it.
 * The function receives that ability, and the actor in case it needs more.
 */
export type Dispatch<A extends Ability> = readonly [
    abilityType: AbilityType<A>,
    perform: (ability: A, actor: InteractingActor) => Promise<void> | void,
];

/**
 * An interaction that picks what to do based on the abilities of the actor.
 */
export abstract class DispatchedInteraction {

    /**
     * Like `Interaction.where`, but with one function per ability. The first
     * pair whose ability the actor has is performed, with that ability passed
     * in. If the actor has none of them, the interaction fails.
     *
     * @example
     *  const openTicket = () =>
     *      DispatchedInteraction.where('#actor opens a ticket',
     *          [UseSupportDeskApi, api => api.post('/tickets', { subject: 'Hello' })],
     *          [BrowseTheWeb, browser => browser.open('/tickets/new')],
     *      );
     *
     * @param description
     *  Description to be used when reporting this interaction, same as for `Interaction.where`
     *
     * @param dispatches
     *  `[AbilityType, function]` pairs, tried in the order given
     */
    static where<Abilities extends Ability[]>(
        description: string,
        ...dispatches: { [Index in keyof Abilities]: Dispatch<Abilities[Index]> }
    ): Interaction {
        return Interaction.where(description, async actor => {
            for (const [abilityType, perform] of dispatches as readonly Dispatch<Ability>[]) {
                if (actor.hasAbilityTo(abilityType)) {
                    await perform(actor.abilityTo(abilityType), actor);
                    return;
                }
            }

            const needed = (dispatches as readonly Dispatch<Ability>[])
                .map(([abilityType]) => abilityType.name)
                .join(', ');

            throw new LogicError(`${ actor.name } needs one of these abilities to perform "${ description }": ${ needed }`);
        });
    }
}
