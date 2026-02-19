import { NextResponse } from "next/server";
import { calculateRecipeMacros } from "@/lib/nutrition";

// ------------------------------------------------------------------
// 1. EXTENSIVE IMAGE DATABASE (Curated High-Quality Unsplash URLs)
// ------------------------------------------------------------------
const FOOD_IMAGES: Record<string, string[]> = {
    // --- PASTA & ITALIAN ---
    "spaghetti": [
        "https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1579631542720-3a87824fff86?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=800&q=80"
    ],
    "pasta": [
        "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80"
    ],
    "lasagna": [
        "https://images.unsplash.com/photo-1574868233972-1d4039fc52e3?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1629115916087-7e8c114a24ed?auto=format&fit=crop&w=800&q=80"
    ],
    "pizza": [
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80"
    ],
    "risotto": [
        "https://images.unsplash.com/photo-1633964893964-154d46d0a773?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80"
    ],

    // --- PROTEINS ---
    "chicken_grilled": [
        "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1614055627253-bfa286390a3c?auto=format&fit=crop&w=800&q=80"
    ],
    "chicken_salad": [
        "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1505253716371-bab3a2913a61?auto=format&fit=crop&w=800&q=80"
    ],
    "steak": [
        "https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1502597863503-48b9c476463b?auto=format&fit=crop&w=800&q=80"
    ],
    "salmon": [
        "https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1536553818318-c2900742d4a2?auto=format&fit=crop&w=800&q=80"
    ],
    "fish": [
        "https://images.unsplash.com/photo-1519708227418-c8fd9a3a2720?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1535568556730-1c39aca86ce3?auto=format&fit=crop&w=800&q=80"
    ],
    "shrimp": [
        "https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80"
    ],
    "burger": [
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80"
    ],

    // --- HEALTHY & VEGGIE ---
    "salad_bowl": [
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1543339308-43e59f6b73a6?auto=format&fit=crop&w=800&q=80"
    ],
    "soup": [
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1543362906-ac1b452601e0?auto=format&fit=crop&w=800&q=80"
    ],
    "tofu": [
        "https://images.unsplash.com/photo-1588723232822-49179d62d4c0?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
    ],
    "wrap": [
        "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1559810626-d6683885d562?auto=format&fit=crop&w=800&q=80"
    ],

    // --- BREAKFAST ---
    "oatmeal": [
        "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1574768340156-f6c770c3c54d?auto=format&fit=crop&w=800&q=80"
    ],
    "eggs": [
        "https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1513442542250-854d436a73f2?auto=format&fit=crop&w=800&q=80"
    ],
    "pancakes": [
        "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80"
    ],
    "toast": [
        "https://images.unsplash.com/photo-1584776296906-6af761f60ca4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1484723091739-30a097e8f9ce?auto=format&fit=crop&w=800&q=80"
    ],
    "smoothie": [
        "https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1623856860064-245b0d611736?auto=format&fit=crop&w=800&q=80"
    ],

    // --- DESSERT ---
    "cake": [
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80"
    ],
    "chocolate": [
        "https://images.unsplash.com/photo-1488477181946-6428a029177b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80"
    ],
    "fruit": [
        "https://images.unsplash.com/photo-1519996521187-8f8c45fb71a9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80"
    ],
    "cookie": [
        "https://images.unsplash.com/photo-1499636138143-bd63bae59453?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80"
    ],

    // --- BRAZILIAN BASICS ---
    "rice_beans": [
        "https://images.unsplash.com/photo-1539755530862-00f623c00f52?auto=format&fit=crop&w=800&q=80", // Rice
        "https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&w=800&q=80"
    ],

    // --- MEAL CONTEXT SPECIFIC ---
    "snack_salty": [ // Cheese boards, nuts, toast
        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1541592106381-b31e967162fd?auto=format&fit=crop&w=800&q=80"
    ],
    "snack_sweet": [ // Granola bars, yogurt
        "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800&q=80",
    ],

    // --- DEFAULT ---
    "default": [
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80", // Meat board
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", // Salad top view
        "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=800&q=80"  // Brunch
    ]
};

// ------------------------------------------------------------------
// 2. SEARCH QUERY GENERATION LOGIC
// ------------------------------------------------------------------

// Keyword Mapping: Portuguese -> English Search Term
const DISH_MAP: Record<string, string> = {
    // Pasta
    "macarrão": "pasta",
    "espaguete": "spaghetti",
    "spaghetti": "spaghetti",
    "massa": "pasta",
    "penne": "pasta",
    "lasanha": "lasagna",
    "bolonhesa": "spaghetti",
    "carbonara": "pasta",
    "noodle": "pasta",

    // Rice & Grains
    "arroz": "rice_beans",
    "risoto": "risotto",
    "quinoa": "salad_bowl",

    // Pizza & Fast Food
    "pizza": "pizza",
    "hambúrguer": "burger",
    "burger": "burger",
    "sandwich": "wrap",
    "sanduíche": "wrap",
    "wrap": "wrap",

    // Chicken
    "frango": "chicken_grilled",
    "galinha": "chicken_grilled",
    "peito": "chicken_grilled",
    "asas": "chicken_grilled",

    // Meat
    "carne": "steak",
    "bife": "steak",
    "picanha": "steak",
    "churrasco": "steak",
    "filé": "steak",
    "moída": "pasta", // Often bolognese

    // Pork
    "porco": "steak",
    "bacon": "breakfast",

    // Fish
    "peixe": "fish",
    "salmão": "salmon",
    "atum": "fish",
    "camarão": "shrimp",
    "frutos do mar": "shrimp",
    "sushi": "fish",

    // Vegetarian / Salad
    "salada": "salad_bowl",
    "legumes": "salad_bowl",
    "vegan": "salad_bowl",
    "vegetariano": "salad_bowl",
    "tofu": "tofu",
    "grão": "salad_bowl",
    "sopa": "soup",
    "caldo": "soup",
    "creme": "soup",

    // Breakfast
    "ovo": "eggs",
    "omelete": "eggs",
    "café": "breakfast",
    "panqueca": "pancakes",
    "tostada": "toast",
    "pão": "toast",
    "mingau": "oatmeal",
    "aveia": "oatmeal",
    "iogurte": "smoothie",
    "granola": "oatmeal",
    "smoothie": "smoothie",

    // Dessert
    "doce": "dessert",
    "bolo": "cake",
    "chocolate": "chocolate",
    "torta": "cake",
    "fruta": "fruit",
    "banana": "fruit",
    "morango": "fruit",
    "sorvete": "dessert",
    "cookie": "cookie",
    "biscoito": "cookie"
};

const MEAL_MAP: Record<string, string> = {
    "café": "breakfast",
    "manhã": "breakfast",
    "desjejum": "breakfast",
    "almoço": "lunch",
    "jantar": "dinner",
    "refeição": "dinner",
    "lanche": "snack",
    "snack": "snack",
    "sobremesa": "dessert"
};

function deriveSearchQuery(title: string, ingredients: string[], tags: string[] = []): string {
    const text = (title + " " + ingredients.join(" ") + " " + tags.join(" ")).toLowerCase();

    let detectedDish = null;
    let detectedMeal = null;

    // 1. Detect Dish (Specific)
    for (const [key, value] of Object.entries(DISH_MAP)) {
        if (text.includes(key)) {
            // Refinement exceptions
            if (key === "frango" && text.includes("salada")) {
                detectedDish = "chicken_salad";
            } else if (key === "macarrão" && text.includes("bolonhesa")) {
                detectedDish = "spaghetti";
            } else {
                detectedDish = value;
            }
            break; // Found a match, break? Better to check all? No, keys order matters.
        }
    }

    // 2. Detect Meal Type (Context)
    for (const [key, value] of Object.entries(MEAL_MAP)) {
        if (text.includes(key)) {
            detectedMeal = value;
            break;
        }
    }

    // 3. Combine Logic (Mocking "searchQuery" construction)
    // Format: "Dish + Context"

    // If we found a specific dish, usually that's strong enough (e.g. "pizza" is pizza regardless of lunch/dinner).
    if (detectedDish) {
        // Special tie-breakers
        if (detectedDish === "eggs" && detectedMeal === "dinner") return "eggs"; // Eggs for dinner is fine
        if (detectedDish === "cake" && detectedMeal === "breakfast") return "cake"; // Cake is cake
        return detectedDish;
    }

    // If no specific dish found, rely on Meal Type
    if (detectedMeal) {
        switch (detectedMeal) {
            case "breakfast": return "breakfast"; // generic breakfast
            case "dessert": return "dessert"; // generic dessert
            case "snack":
                // Try to guess sweet/salty
                if (text.includes("fruta") || text.includes("iogurte") || text.includes("s doce")) return "snack_sweet";
                return "snack_salty";
            case "lunch":
            case "dinner":
                return "default"; // generic savory meal
        }
    }

    // Fallback
    if (text.includes("doce") || text.includes("açúcar")) return "dessert";

    return "default";
}

function getUnsplashImage(query: string): string {
    const images = FOOD_IMAGES[query] || FOOD_IMAGES["default"];
    return images[Math.floor(Math.random() * images.length)];
}

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        // Simulate AI Processing Delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const p = prompt.toLowerCase();
        let recipeData: any = {};

        // ------------------------------------------------------------------
        // 3. GENERATION LOGIC (Expands prompts to cover new categories)
        // ------------------------------------------------------------------

        // PASTA Logic
        if (p.includes("macarrão") || p.includes("massa") || p.includes("bolonhesa") || p.includes("espaguete")) {
            recipeData = {
                title: "Spaghetti à Bolonhesa Fit com Manjericão",
                description: "Um clássico italiano em versão mais leve e nutritiva.",
                tags: ["Almoço", "Massa", "Conforto"],
                prep_time_minutes: 25,
                servings: 1,
                ingredients: ["100g de macarrão integral", "100g de carne moída magra", "Molho de tomate caseiro", "Folhas de manjericão", "1 colher de azeite"],
                steps: ["Cozinhe o macarrão al dente.", "Refogue a carne com temperos e molho.", "Misture tudo e finalize com manjericão."]
            };
        }
        // CHICKEN SALAD Logic
        else if ((p.includes("salada") && p.includes("frango")) || p.includes("leve")) {
            recipeData = {
                title: "Salada Caesar de Frango Grelhado",
                description: "Refeição leve, proteica e crocante.",
                tags: ["Salada", "Baixo Carb", "Jantar"],
                prep_time_minutes: 15,
                servings: 1,
                ingredients: ["150g de peito de frango", "Mix de folhas verdes", "Queijo parmesão ralado", "Croutons integrais", "Molho de iogurte e limão"],
                steps: ["Grelhe o frango em tiras.", "Monte a salada com as folhas.", "Adicione o frango e o molho."]
            };
        }
        // VEGAN BOWL Logic
        else if (p.includes("vegan") || p.includes("vegetariano")) {
            recipeData = {
                title: "Bowl Vegano de Quinoa e Grão-de-Bico",
                description: "Energia pura e proteína vegetal em um prato colorido.",
                tags: ["Vegano", "Almoço", "Saudável"],
                prep_time_minutes: 20,
                servings: 1,
                ingredients: ["100g de quinoa cozida", "100g de grão de bico", "Abacate fatiado", "Tomate cereja", "Sementes de abóbora"],
                steps: ["Disponha a quinoa e o grão de bico no bowl.", "Decore com os vegetais.", "Tempere com azeite e limão."]
            };
        }
        // DESSERT Logic
        else if (p.includes("doce") || p.includes("bolo") || p.includes("sobremesa")) {
            recipeData = {
                title: "Muffin de Banana com Cacau e Aveia",
                description: "Para matar a vontade de doce sem sair da dieta.",
                tags: ["Sobremesa", "Lanche", "Doce"],
                prep_time_minutes: 25,
                servings: 1,
                ingredients: ["1 banana madura", "1 ovo", "2 colheres de aveia", "1 colher de cacau em pó", "1 colher de mel"],
                steps: ["Amasse a banana e misture tudo.", "Coloque em forminhas.", "Asse por 15-20 min."]
            };
        }
        // BREAKFAST Logic
        else if (p.includes("café") || p.includes("manhã") || p.includes("panqueca")) {
            recipeData = {
                title: "Panqueca de Aveia e Mel",
                description: "Comece o dia com energia e fibras.",
                tags: ["Café da Manhã", "Rápido", "Energia"],
                prep_time_minutes: 10,
                servings: 1,
                ingredients: ["1 ovo", "30g de aveia", "1 colher de leite", "Mel para finalizar", "Frutas vermelhas"],
                steps: ["Misture o ovo, aveia e leite.", "Faça discos na frigideira.", "Sirva com mel e frutas."]
            };
        }
        // PIZZA Logic
        else if (p.includes("pizza")) {
            recipeData = {
                title: "Pizza de Rap10 Fit de Frango e Queijo",
                description: "Mata a vontade de pizza em 5 minutos.",
                tags: ["Lanche", "Rápido", "Pizza"],
                prep_time_minutes: 5,
                servings: 1,
                ingredients: ["1 disco de Rap10 integral", "50g de frango desfiado", "30g de queijo mussarela", "Orégano e tomate"],
                steps: ["Monte a pizza no disco.", "Leve a frigideira ou airfryer.", "Espere o queijo derreter."]
            };
        }
        // DEFAULT Logic (Chicken Dish)
        else if (p.includes("frango")) {
            recipeData = {
                title: "Frango Grelhado com Legumes Salteados",
                description: "Simples, eficiente e cheio de sabor.",
                tags: ["Almoço", "Jantar", "Alta Proteína"],
                prep_time_minutes: 20,
                servings: 1,
                ingredients: ["150g de peito de frango", "1 cenoura em rodelas", "1 abobrinha em cubos", "Azeite e ervas"],
                steps: ["Grelhe o frango.", "Na mesma panela, salteie os legumes al dente.", "Sirva quente."]
            };
        }
        // FALLBACK
        else {
            recipeData = {
                title: "Omelete Completa de Forno",
                description: "Prático para deixar pronto na geladeira.",
                tags: ["Jantar", "Low Carb", "Ovo"],
                prep_time_minutes: 15,
                servings: 1,
                ingredients: ["2 ovos", "30g de queijo", "Espinafre picado", "Tomate cereja"],
                steps: ["Bata os ovos com os ingredientes.", "Coloque em uma forma pequena.", "Asse até firmar."]
            };
        }

        // Calculate Macros
        const { macros, ingredientsFormatted } = calculateRecipeMacros(recipeData.ingredients, recipeData.servings);

        // ------------------------------------------------------------------
        // 4. SMART IMAGE SEARCH
        // ------------------------------------------------------------------
        const searchQuery = deriveSearchQuery(recipeData.title, recipeData.ingredients, recipeData.tags);
        console.log(`[AI] Prompt: "${p}" -> Title: "${recipeData.title}" -> SearchQuery: "${searchQuery}"`);

        const imageUrl = getUnsplashImage(searchQuery);

        return NextResponse.json({
            ...recipeData,
            macros,
            ingredients: ingredientsFormatted,
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
