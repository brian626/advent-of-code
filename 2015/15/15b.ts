
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./15.input', 'utf-8');

const lines = file.split('\n');

class Ingredient {
    name: string;
    capacity: number;
    durability: number;
    flavor: number;
    texture: number;
    calories: number;
}

const ingredients: Ingredient[] = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const [name, _1, capacity, _2, durability, _3, flavor, _4, texture, _5, calories] = lines[i].split(' ');

    const ingredient = new Ingredient();
    ingredient.name = name.slice(0, -1);
    ingredient.capacity = parseInt(capacity.slice(0, -1));
    ingredient.durability = parseInt(durability.slice(0, -1));
    ingredient.flavor = parseInt(flavor.slice(0, -1));
    ingredient.texture = parseInt(texture.slice(0, -1));
    ingredient.calories = parseInt(calories);
    ingredients.push(ingredient);
}

// console.log(ingredients);

let maxScore = 0;
for (let ing1 = 0; ing1 <= 100; ing1++) {
    for (let ing2 = 0; ing2 <= 100 - ing1; ing2++) {
        for (let ing3 = 0; ing3 <= 100 - ing1 - ing2; ing3++) {
            const ing4 = 100 - ing1 - ing2 - ing3;

            if (ing1 * ingredients[0].calories +
                ing2 * ingredients[1].calories +
                ing3 * ingredients[2].calories +
                ing4 * ingredients[3].calories === 500) {
                maxScore = Math.max(maxScore, score([ing1, ing2, ing3, ing4]));
            }
        }
    }
}

console.log(maxScore);


function score(ingredientAmounts: number[]): number {
    let capacity = 0;
    let durability = 0;
    let flavor = 0;
    let texture = 0;

    for (let i = 0; i < ingredientAmounts.length; i++) {
        capacity += ingredientAmounts[i] * ingredients[i].capacity;
        durability += ingredientAmounts[i] * ingredients[i].durability;
        flavor += ingredientAmounts[i] * ingredients[i].flavor;
        texture += ingredientAmounts[i] * ingredients[i].texture;
    }

    if (capacity < 0) { capacity = 0; }
    if (durability < 0) { durability = 0; }
    if (flavor < 0) { flavor = 0; }
    if (texture < 0) { texture = 0; }

    return capacity * durability * flavor * texture;
}
