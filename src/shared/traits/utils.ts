import { TraitDefinition } from "./traits";

export function getTraitTotalCost(trait: TraitDefinition) {
    return trait.levels
        .slice(1)
        .reduce((sum, level) => sum + level.cost, 0);
}

export function getUnlockedTraitLevel(
    trait: TraitDefinition,
    spentPoints: number,
) {
    let unlockedLevel = 1;
    let required = 0;

    for (let i = 1; i < trait.levels.length; i++) {
        required += trait.levels[i].cost;

        if (spentPoints >= required) {
            unlockedLevel = i + 1;
        } else {
            break;
        }
    }

    return unlockedLevel;
}

export function getTraitProgress(
    trait: TraitDefinition,
    spentPoints: number,
) {
    const unlockedLevel = getUnlockedTraitLevel(
        trait,
        spentPoints
    );

    const totalCost = getTraitTotalCost(trait);
    const isMaxed = spentPoints >= totalCost;

    const currentLevel = trait.levels[unlockedLevel - 1];
    const nextLevel = trait.levels[unlockedLevel];

    const spentBeforeNextLevel = trait.levels
        .slice(1, unlockedLevel)
        .reduce((sum, level) => sum + level.cost, 0);

    const progressToNextLevel =
        spentPoints - spentBeforeNextLevel;

    return {
        unlockedLevel,
        currentLevel,
        nextLevel,
        progressToNextLevel,
        totalCost,
        isMaxed,
    };
}