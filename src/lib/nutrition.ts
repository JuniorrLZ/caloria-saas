export interface FoodItem {
    name: string;
    unit: string;
    amount: number; // Base amount for nutrition values (e.g., 100g)
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    category: 'protein' | 'carb' | 'fat' | 'vegetable' | 'fruit' | 'dairy' | 'other';
}

export const FOOD_DATABASE: FoodItem[] = [
    // Carbohydrates
    { name: "arroz", unit: "g", amount: 100, calories: 130, protein: 2.7, carbs: 28, fat: 0.3, category: "carb" },
    { name: "arroz integral", unit: "g", amount: 100, calories: 110, protein: 2.6, carbs: 23, fat: 0.9, category: "carb" },
    { name: "feijão", unit: "g", amount: 100, calories: 76, protein: 5, carbs: 13.6, fat: 0.5, category: "carb" },
    { name: "macarrão", unit: "g", amount: 100, calories: 157, protein: 5.8, carbs: 30, fat: 0.9, category: "carb" },
    { name: "aveia", unit: "g", amount: 30, calories: 114, protein: 4.3, carbs: 17, fat: 2.2, category: "carb" },
    { name: "batata doce", unit: "g", amount: 100, calories: 86, protein: 1.6, carbs: 20, fat: 0.1, category: "carb" },
    { name: "pão francês", unit: "unidade", amount: 1, calories: 135, protein: 4.5, carbs: 28, fat: 0.5, category: "carb" },
    { name: "pão integral", unit: "fatia", amount: 1, calories: 60, protein: 3, carbs: 11, fat: 1, category: "carb" },
    { name: "batata", unit: "g", amount: 100, calories: 77, protein: 2, carbs: 17, fat: 0.1, category: "carb" },
    { name: "mandioca", unit: "g", amount: 100, calories: 160, protein: 1.4, carbs: 38, fat: 0.3, category: "carb" },

    // Proteins
    { name: "frango", unit: "g", amount: 100, calories: 165, protein: 31, carbs: 0, fat: 3.6, category: "protein" },
    { name: "peito de frango", unit: "g", amount: 100, calories: 165, protein: 31, carbs: 0, fat: 3.6, category: "protein" },
    { name: "carne moída", unit: "g", amount: 100, calories: 250, protein: 26, carbs: 0, fat: 15, category: "protein" },
    { name: "patinho", unit: "g", amount: 100, calories: 185, protein: 35, carbs: 0, fat: 4, category: "protein" },
    { name: "ovo", unit: "unidade", amount: 1, calories: 70, protein: 6, carbs: 0.5, fat: 5, category: "protein" },
    { name: "claras", unit: "unidade", amount: 1, calories: 17, protein: 3.6, carbs: 0.2, fat: 0.1, category: "protein" },
    { name: "atum", unit: "lata", amount: 1, calories: 120, protein: 26, carbs: 0, fat: 1, category: "protein" },
    { name: "peixe", unit: "g", amount: 100, calories: 100, protein: 20, carbs: 0, fat: 3, category: "protein" },
    { name: "tilápia", unit: "g", amount: 100, calories: 96, protein: 20, carbs: 0, fat: 1.7, category: "protein" },

    // Dairy
    { name: "leite", unit: "ml", amount: 200, calories: 120, protein: 6, carbs: 10, fat: 6, category: "dairy" },
    { name: "leite desnatado", unit: "ml", amount: 200, calories: 70, protein: 6, carbs: 10, fat: 0, category: "dairy" },
    { name: "queijo", unit: "g", amount: 30, calories: 100, protein: 7, carbs: 1, fat: 8, category: "dairy" },
    { name: "queijo branco", unit: "g", amount: 30, calories: 70, protein: 5, carbs: 1, fat: 5, category: "dairy" },
    { name: "iogurte natural", unit: "unidade", amount: 1, calories: 100, protein: 6, carbs: 10, fat: 6, category: "dairy" },
    { name: "whey", unit: "scoop", amount: 1, calories: 120, protein: 24, carbs: 3, fat: 1, category: "dairy" },

    // Fruits & Vegetables
    { name: "banana", unit: "unidade", amount: 1, calories: 105, protein: 1.3, carbs: 27, fat: 0.4, category: "fruit" },
    { name: "maçã", unit: "unidade", amount: 1, calories: 95, protein: 0.5, carbs: 25, fat: 0.3, category: "fruit" },
    { name: "abacate", unit: "g", amount: 100, calories: 160, protein: 2, carbs: 9, fat: 15, category: "fruit" },
    { name: "brócolis", unit: "xícara", amount: 1, calories: 30, protein: 2.5, carbs: 6, fat: 0.3, category: "vegetable" },
    { name: "cenoura", unit: "unidade", amount: 1, calories: 25, protein: 0.5, carbs: 6, fat: 0.1, category: "vegetable" },
    { name: "tomate", unit: "unidade", amount: 1, calories: 22, protein: 1, carbs: 5, fat: 0.2, category: "vegetable" },
    { name: "alface", unit: "g", amount: 100, calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, category: "vegetable" },

    // Fats
    { name: "azeite", unit: "colher", amount: 1, calories: 119, protein: 0, carbs: 0, fat: 13.5, category: "fat" },
    { name: "manteiga", unit: "colher", amount: 1, calories: 102, protein: 0.1, carbs: 0, fat: 11.5, category: "fat" },
    { name: "castanha", unit: "g", amount: 30, calories: 180, protein: 5, carbs: 6, fat: 16, category: "fat" },
];

export interface IngredientMacro {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    isEstimated: boolean;
}

export function calculateIngredientMacros(ingredientText: string): IngredientMacro {
    const lowerText = ingredientText.toLowerCase();

    // 1. Try to find approximate quantity
    let quantity = 1; // Default
    const numberMatch = lowerText.match(/^([\d.,]+)/); // Matches "2", "1.5", "100" at start
    if (numberMatch) {
        quantity = parseFloat(numberMatch[1].replace(',', '.'));
    }

    // 2. Find matching food item
    const match = FOOD_DATABASE.find(item => lowerText.includes(item.name.toLowerCase()));

    if (match) {
        // Simple heuristic: if the user specifies grams explicitly (e.g., "200g"), assume the quantity is scaled relative to the item's base amount
        // If unit is "unidade" or "colher", just multiply by quantity found.
        let multiplier = quantity;

        // If defined unit is grams but text implies servings or pieces that aren't grams, it's hard.
        // For simplicity:
        // If the database item defines unit as 'g', and input string has "g" or "gramas", use ratio.
        // Else if input string has no unit or "unidade", treat as 1 unit if database is 'unidade',
        // or just assume 1 serving (100g) if database is 'g'.

        // Refined Logic:
        if (match.unit === 'g') {
            if (lowerText.includes('kg')) {
                multiplier = quantity * 10; // 1 kg = 10 * 100g
            } else if (lowerText.includes('g') || lowerText.includes('gramas')) {
                multiplier = quantity / match.amount;
            } else {
                // Fallback: If no weight unit found ("1 peito de frango"), assume 1 "serving" equivalent to base amount (usually 100g for meats/carbs)
                // This is a rough estimation.
                // "2 filés" -> assume 2 * 100g
                multiplier = quantity;
            }
        } else {
            // Unit is 'unidade', 'fatia', 'lata', etc.
            // Direct multiplication
            multiplier = quantity;
        }

        return {
            name: match.name,
            calories: Math.round(match.calories * multiplier),
            protein: Math.round(match.protein * multiplier),
            carbs: Math.round(match.carbs * multiplier),
            fat: Math.round(match.fat * multiplier),
            isEstimated: false
        };
    }

    // 3. Fallback estimations
    let fallbackValues = { c: 0, p: 0, carb: 0, f: 0 };

    if (lowerText.includes("legume") || lowerText.includes("verdura") || lowerText.includes("salada")) {
        fallbackValues = { c: 30, p: 1, carb: 5, f: 0 }; // Low cal generic
    } else if (lowerText.includes("molho") || lowerText.includes("tempero") || lowerText.includes("sal") || lowerText.includes("pimenta")) {
        fallbackValues = { c: 10, p: 0, carb: 1, f: 0 }; // Negligible
    } else if (lowerText.includes("carne") || lowerText.includes("bife")) {
        fallbackValues = { c: 200, p: 25, carb: 0, f: 10 }; // Generic meat 100g
    } else if (lowerText.includes("azeite") || lowerText.includes("óleo")) {
        fallbackValues = { c: 120, p: 0, carb: 0, f: 14 }; // Oil portion
    } else {
        // Unknown
        return { name: "unknown", calories: 0, protein: 0, carbs: 0, fat: 0, isEstimated: true };
    }

    // Apply quantity to fallback
    // Simplification: assume fallback is "per mentioned item"
    return {
        name: "estimated",
        calories: Math.round(fallbackValues.c * quantity),
        protein: Math.round(fallbackValues.p * quantity),
        carbs: Math.round(fallbackValues.carb * quantity),
        fat: Math.round(fallbackValues.f * quantity),
        isEstimated: true
    };
}


export function calculateRecipeMacros(ingredients: string[], servings: number = 1) {
    let total = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    let hasEstimations = false;

    ingredients.forEach(ing => {
        const macros = calculateIngredientMacros(ing);
        total.calories += macros.calories;
        total.protein += macros.protein;
        total.carbs += macros.carbs;
        total.fat += macros.fat;
        if (macros.isEstimated) hasEstimations = true;
    });

    // Ensure safe division
    const s = servings < 1 ? 1 : servings;

    return {
        macros: {
            calories: Math.round(total.calories / s),
            protein: Math.round(total.protein / s),
            carbs: Math.round(total.carbs / s),
            fat: Math.round(total.fat / s)
        },
        ingredientsFormatted: ingredients,
        isEstimated: hasEstimations
    };
}
