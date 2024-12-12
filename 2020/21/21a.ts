
import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./21.test', 'utf-8');

const lines = file.split('\n');

// mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
// trh fvjkl sbzzf mxmxvkd (contains dairy)
// sqjhc fvjkl (contains soy)
// sqjhc mxmxvkd sbzzf (contains fish)

class Food {
    name: string;
    ingredients: Ingredient[];

    constructor(n: string) {
        this.name = n;
        this.ingredients = [];
    }
}

class Ingredient {
    name: string;
    allergens: Set<string>;

    constructor(n: string, a: string[]) {
        this.name = n;
        this.allergens = new Set(a);
    }

    addAllergen(a: string) {
        this.allergens.add(a);
    }
}

const foods: Food[] = [];
const ingredients: Map<string, Ingredient> = new Map<string, Ingredient>();

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    const f = new Food(i.toString());

    const [ingredientList, allergenList] = lines[i].split(' (');
    for (const ing of ingredientList.split(' ')) {
        let I = ingredients.get(ing);
        if (!I) {
            I = new Ingredient(ing, []);
        }

        for (const all of allergenList.replace(')', '').replace(',', '').split(' ')) {
            if (all === 'contains') { continue; }
            I.addAllergen(all);
        }

        ingredients.set(ing, I);
        f.ingredients.push(I);
    }

    foods.push(f);
}


// console.log(ingredients);
// console.log(foods);
printFoods();

function printFoods() {
    for (const f of foods) {
        console.log(`Food ${f.name}: [${f.ingredients.map(x => x.name)}]`);
    }
    console.log();
}
