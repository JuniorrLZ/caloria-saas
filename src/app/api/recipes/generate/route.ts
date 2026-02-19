import { NextResponse } from "next/server";
import { calculateRecipeMacros } from "@/lib/nutrition";

// ------------------------------------------------------------------
// 1. IMAGE DATABASE (Unsplash Fallbacks)
// ------------------------------------------------------------------
const FOOD_IMAGES: Record<string, string[]> = {
    // PROTEINS
    "chicken": [
        "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80"
    ],
    "beef": [
        "https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80"
    ],
    "fish": [
        "https://images.unsplash.com/photo-1519708227418-c8fd9a3a2720?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1535568556730-1c39aca86ce3?auto=format&fit=crop&w=800&q=80"
    ],
    "eggs": [
        "https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=80"
    ],
    // CARBS
    "pasta": [
        "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=800&q=80"
    ],
    "rice": [
        "https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1539755530862-00f623c00f52?auto=format&fit=crop&w=800&q=80"
    ],
    "pancakes": [
        "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80"
    ],
    "oatmeal": [
        "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800&q=80"
    ],
    "toast": [
        "https://images.unsplash.com/photo-1584776296906-6af761f60ca4?auto=format&fit=crop&w=800&q=80"
    ],
    // BOWLS & SALADS
    "salad": [
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
    ],
    "soup": [
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80"
    ],
    // FAST FOOD / SNACKS
    "burger": [
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
    ],
    "pizza": [
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80"
    ],
    "wrap": [
        "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80"
    ],
    // DESSERT
    "cake": [
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
    ],
    "dessert": [
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80"
    ],
    "default": [
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
    ]
};

// ------------------------------------------------------------------
// 2. PROCEDURAL RECIPE GENERATOR
// ------------------------------------------------------------------

// Ingredient Pool (Matches nutrition.ts keys mostly)
const INGREDIENTS = {
    proteins: ["150g de frango", "150g de patinho", "150g de tilápia", "2 ovos", "100g de tofu", "1 lata de atum"],
    carbs: ["100g de arroz integral", "100g de arroz branco", "100g de macarrão", "150g de batata doce", "150g de batata inglesa", "2 fatias de pão integral"],
    veggies: ["1 xícara de brócolis", "1 cenoura ralada", "1/2 abobrinha", "Mix de folhas verdes", "1 tomate picado"],
    fats: ["1 colher de azeite", "30g de castanha", "1 colher de manteiga", "1/4 de abacate"],
    flavor: ["Sal e pimenta", "Limão", "Orégano", "Alho e cebola", "Cheiro verde"],

    // Breakfast specific
    breakfastBase: ["2 ovos", "30g de aveia", "1 banana", "1 iogurte natural", "2 fatias de pão"],
    breakfastAdd: ["1 colher de mel", "Canela", "30g de queijo", "Frutas vermelhas"],
};

// Templates
const TEMPLATES = {
    plate: (protein: string, carb: string, veg: string) => ({
        title: `${cleanName(protein)} com ${cleanName(carb)} e ${cleanName(veg)}`,
        type: "plate",
        steps: [
            `Tempere o(a) ${cleanName(protein).toLowerCase()} com sal e limão.`,
            `Grelhe ou cozinhe até o ponto desejado.`,
            `Prepare o(a) ${cleanName(carb).toLowerCase()} conforme sua preferência.`,
            `Sirva o prato montado com o(a) ${cleanName(veg).toLowerCase()} ao lado.`
        ]
    }),
    pasta: (protein: string) => ({
        title: `Macarrão Integral com ${cleanName(protein)} ao Sugo`,
        type: "pasta",
        steps: [
            "Cozinhe o macarrão al dente.",
            `Refogue o(a) ${cleanName(protein).toLowerCase()} com alho e cebola.`,
            "Adicione molho de tomate natural.",
            "Misture a massa e finalize com manjericão."
        ]
    }),
    salad: (protein: string) => ({
        title: `Salada Completa com ${cleanName(protein)}`,
        type: "salad",
        steps: [
            "Lave bem as folhas e vegetais.",
            `Grelhe o(a) ${cleanName(protein).toLowerCase()} em tiras.`,
            "Monte o bowl com a base verde.",
            "Adicione o azeite e sirva fresco."
        ]
    }),
    breakfast: (base: string, add: string) => ({
        title: `${cleanName(base)} com ${cleanName(add)}`,
        type: "breakfast",
        steps: [
            `Prepare o(a) ${cleanName(base).toLowerCase()}.`,
            `Adicione ${cleanName(add).toLowerCase()} para complementar.`,
            "Sirva imediatamente."
        ]
    })
};

function cleanName(str: string) {
    // "150g de frango" -> "Frango"
    return str.replace(/[\d.,]+\s*(g|kg|l|ml|unidade|fatia|lata|xícara|colher)\s*(de\s*)?/gi, "").replace(/^\w/, c => c.toUpperCase()).trim();
}

function selectIngredients(prompt: string) {
    const p = prompt.toLowerCase();

    // Detect Preference
    const isVegan = p.includes("vegan") || p.includes("vegetariano");
    const isLowCarb = p.includes("low carb") || p.includes("sem carbo");
    const isPasta = p.includes("macarrão") || p.includes("massa");
    const isBreakfast = p.includes("café") || p.includes("manhã") || p.includes("panqueca") || p.includes("ovo");
    const isSnack = p.includes("lanche");
    const isDessert = p.includes("doce") || p.includes("sobremesa");

    // Select Base Items
    let protein = isVegan ? "100g de tofu" : (p.includes("frango") ? "150g de frango" : p.includes("carne") ? "150g de patinho" : p.includes("peixe") ? "150g de tilápia" : INGREDIENTS.proteins[Math.floor(Math.random() * 3)]); // Default to meat options
    let carb = isLowCarb ? "150g de abóbora" : (p.includes("arroz") ? "100g de arroz integral" : p.includes("batata") ? "150g de batata doce" : INGREDIENTS.carbs[Math.floor(Math.random() * 3)]);
    let veg = INGREDIENTS.veggies[Math.floor(Math.random() * INGREDIENTS.veggies.length)];
    let fat = INGREDIENTS.fats[0]; // Azeite default

    // Force Pasta logic
    if (isPasta && !isLowCarb) carb = "100g de macarrão";

    return { protein, carb, veg, fat, isVegan, isLowCarb, isPasta, isBreakfast, isSnack, isDessert };
}

function buildRecipe(prompt: string) {
    const sel = selectIngredients(prompt);
    let recipe: any = {};
    let ingredientsList: string[] = [];

    // 1. DESSERT
    if (sel.isDessert) {
        recipe = {
            title: "Mousse de Cacau com Abacate Fit",
            prep_time_minutes: 10,
            tags: ["Sobremesa", "Doce", "Rápido"],
            servings: 1
        };
        ingredientsList = ["100g de abacate", "1 colher de cacau em pó", "Mel a gosto"];
        recipe.steps = ["Bata tudo no processador.", "Leve à geladeira por 30min.", "Sirva gelado."];
        recipe.type = "dessert";
    }
    // 2. BREAKFAST
    else if (sel.isBreakfast) {
        const base = prompt.includes("aveia") ? "30g de aveia" : "2 ovos";
        const add = prompt.includes("fruta") ? "1 banana" : "30g de queijo";
        const tmpl = TEMPLATES.breakfast(base, add);

        recipe = { ...tmpl, prep_time_minutes: 10, tags: ["Café da Manhã", "Energia"], servings: 1 };
        ingredientsList = [base, add];
        if (base.includes("aveia")) ingredientsList.push("1 iogurte natural");
        else ingredientsList.push("1 fatia de pão integral");
        recipe.type = "breakfast";
    }
    // 3. PASTA
    else if (sel.isPasta) {
        const tmpl = TEMPLATES.pasta(sel.protein);
        recipe = { ...tmpl, prep_time_minutes: 20, tags: ["Almoço", "Massa"], servings: 1 };
        ingredientsList = ["100g de macarrão", sel.protein, "Molho de tomate", "Manjericão", sel.fat];
        recipe.type = "pasta";
    }
    // 4. LOW CARB / SALAD
    else if (sel.isLowCarb || prompt.includes("salada")) {
        const tmpl = TEMPLATES.salad(sel.protein);
        recipe = { ...tmpl, prep_time_minutes: 15, tags: ["Low Carb", "Leve"], servings: 1 };
        ingredientsList = [sel.protein, "Mix de folhas verdes", sel.veg, sel.fat, "Limão"];
        recipe.type = "salad";
    }
    // 5. STANDARD PLATE (Default)
    else {
        const tmpl = TEMPLATES.plate(sel.protein, sel.carb, sel.veg);
        recipe = { ...tmpl, prep_time_minutes: 25, tags: ["Almoço", "Jantar", "Equilibrado"], servings: 1 };
        ingredientsList = [sel.protein, sel.carb, sel.veg, sel.fat, "Sal e pimenta"];
        recipe.type = "plate";
    }

    return { ...recipe, ingredients: ingredientsList };
}

// ------------------------------------------------------------------
// 3. VALIDATOR & FIXER
// ------------------------------------------------------------------
function validateAndFix(recipe: any, prompt: string) {
    // Rule 1: No "Suco" in savory (Simulated check, though our generator is safe by design now)
    const title = recipe.title.toLowerCase();

    // Scale Macros if needed
    // Calculate first
    let { macros, ingredientsFormatted } = calculateRecipeMacros(recipe.ingredients, recipe.servings);

    // Context Check
    const isSnack = prompt.includes("lanche") || recipe.tags.includes("Lanche");

    // Fix: If snack is too heavy (>600kcal), reduce quantities
    if (isSnack && macros.calories > 600) {
        // Halve the ingredients effectively (simulated by halving servings logic or just reducing displayed macros)
        // Better: Update ingredients text
        ingredientsFormatted = ingredientsFormatted.map((ing: string) => {
            const match = ing.match(/^(\d+)/);
            if (match) {
                const num = parseInt(match[1]);
                return ing.replace(match[1], Math.floor(num * 0.6).toString());
            }
            return ing;
        });
        // Recalculate
        const recalc = calculateRecipeMacros(ingredientsFormatted, recipe.servings);
        macros = recalc.macros;
    }

    // Add Meal Type Tag if missing
    if (!recipe.tags.some((t: string) => ["Almoço", "Jantar", "Café da Manhã", "Lanche", "Sobremesa"].includes(t))) {
        if (recipe.type === "breakfast") recipe.tags.push("Café da Manhã");
        else if (recipe.type === "dessert") recipe.tags.push("Sobremesa");
        else recipe.tags.push("Almoço/Jantar");
    }

    // High Protein Tag logic
    if (macros.protein > 30 && !recipe.tags.includes("Alta Proteína")) {
        recipe.tags.push("Alta Proteína");
    }

    return { ...recipe, macros, ingredients: ingredientsFormatted };
}

// ------------------------------------------------------------------
// 4. IMAGE SEARCH
// ------------------------------------------------------------------
function getSmartImage(title: string, type: string) {
    const t = title.toLowerCase();

    // Exact mapping logic
    let keyword = "default";

    if (type === "dessert") keyword = "dessert";
    else if (type === "breakfast") {
        if (t.includes("panqueca")) keyword = "pancakes";
        else if (t.includes("aveia")) keyword = "oatmeal";
        else keyword = "eggs"; // safe bet
    }
    else if (type === "pasta") keyword = "pasta";
    else if (type === "salad") keyword = "salad";
    else {
        // Plate logic
        if (t.includes("frango")) keyword = "chicken";
        else if (t.includes("carne") || t.includes("patinho") || t.includes("bife")) keyword = "beef";
        else if (t.includes("peixe") || t.includes("tilápia")) keyword = "fish";
        else if (t.includes("ovo")) keyword = "eggs";
        else if (t.includes("pizza")) keyword = "pizza";
        else if (t.includes("burguer")) keyword = "burger";
        else if (t.includes("sopa")) keyword = "soup";
    }

    const images = FOOD_IMAGES[keyword] || FOOD_IMAGES["default"];
    return images[Math.floor(Math.random() * images.length)];
}


export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        // Simulate AI Processing Delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 1. Generate Base
        let recipe = buildRecipe(prompt);

        // 2. Validate & Fix & Calc Macros
        recipe = validateAndFix(recipe, prompt.toLowerCase());

        // 3. Get Image
        const imageUrl = getSmartImage(recipe.title, recipe.type);

        return NextResponse.json({
            ...recipe,
            image_url: imageUrl,
            is_ai_generated: true,
            user_generated: true
        });

    } catch (error) {
        console.error("AI Generation Error:", error);
        return NextResponse.json(
            { error: "Failed to generate recipe" },
            { status: 500 }
        );
    }
}
