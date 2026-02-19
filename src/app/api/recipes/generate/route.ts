import { NextResponse } from "next/server";
import { calculateRecipeMacros } from "@/lib/nutrition";

// Reuse previous image logic
const FOOD_IMAGES: Record<string, string[]> = {
    "chicken": [
        "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1614055627253-bfa286390a3c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80",
    ],
    "beef": [
        "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&w=800&q=80",
    ],
    "pork": [
        "https://images.unsplash.com/photo-1602494191376-7c60d84c0a52?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1624838644385-d8aa1368fc33?auto=format&fit=crop&w=800&q=80",
    ],
    "fish": [
        "https://images.unsplash.com/photo-1519708227418-c8fd9a3a2720?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1534948216015-843143f7aa67?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1535568556730-1c39aca86ce3?auto=format&fit=crop&w=800&q=80",
    ],
    "vegan": [
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1543339308-43e59f6b73a6?auto=format&fit=crop&w=800&q=80",
    ],
    "pasta": [
        "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=800&q=80",
    ],
    "breakfast": [
        "https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=80",
    ],
    "dessert": [
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1488477181946-6428a029177b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80",
    ],
    "soup": [
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1543362906-ac1b452601e0?auto=format&fit=crop&w=800&q=80",
    ],
    "burger": [
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    ],
    "rice": [
        "https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1539755530862-00f623c00f52?auto=format&fit=crop&w=800&q=80",
    ],
    "pizza": [
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    ],
    "appetizer": [
        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
    ],
    "default": [
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    ]
};

function getUnsplashImage(query: string): string {
    const q = query.toLowerCase();
    let category = "default";

    // Logic matching...
    if (q.includes("frango") || q.includes("galinha") || q.includes("chicken")) category = "chicken";
    else if (q.includes("carne") || q.includes("bife") || q.includes("beef") || q.includes("steak")) category = "beef";
    else if (q.includes("porco") || q.includes("bacon") || q.includes("pork")) category = "pork";
    else if (q.includes("peixe") || q.includes("salmão") || q.includes("atum") || q.includes("fish")) category = "fish";
    else if (q.includes("vegan") || q.includes("vegetariano") || q.includes("salada")) category = "vegan";
    else if (q.includes("macarrão") || q.includes("massa") || q.includes("pasta")) category = "pasta";
    else if (q.includes("arroz") || q.includes("risoto")) category = "rice";
    else if (q.includes("doce") || q.includes("sobremesa") || q.includes("chocolate")) category = "dessert";
    else if (q.includes("café") || q.includes("ovo") || q.includes("panqueca")) category = "breakfast";
    else if (q.includes("hambúrguer") || q.includes("burger")) category = "burger";
    else if (q.includes("pizza")) category = "pizza";
    else if (q.includes("sopa")) category = "soup";

    const images = FOOD_IMAGES[category] || FOOD_IMAGES["default"];
    return images[Math.floor(Math.random() * images.length)];
}

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        // Simulate AI Processing Delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const p = prompt.toLowerCase();
        let recipeData: any = {};

        // Mock AI Generation - Deterministic but rich
        if (p.includes("frango")) {
            recipeData = {
                title: "Filé de Frango Grelhado com Arroz e Brócolis",
                description: "Clássico da dieta fit, rico em proteínas e com carboidratos de boa qualidade.",
                tags: ["Alta Proteína", "Almoço", "Frango"],
                prep_time_minutes: 25,
                servings: 1,
                ingredients: [
                    "150g de peito de frango",
                    "100g de arroz integral cozido",
                    "1 xícara de brócolis cozido",
                    "1 colher de azeite",
                    "Sal e limão a gosto"
                ],
                steps: [
                    "Tempere o frango com limão e sal.",
                    "Grelhe no azeite até dourar.",
                    "Sirva com o arroz e o brócolis."
                ]
            };
        } else if (p.includes("vegan") || p.includes("vegetariano")) {
            recipeData = {
                title: "Salada de Grão-de-Bico com Abacate",
                description: "Refrescante, nutritiva e totalmente vegetal.",
                tags: ["Vegano", "Rápido", "Sem Glúten"],
                prep_time_minutes: 15,
                servings: 1,
                ingredients: [
                    "150g de feijão cozido (substituindo grão de bico na base)", // Adapting to base
                    "100g de abacate",
                    "Tomate picado",
                    "1 colher de azeite",
                    "Salsinha picada"
                ],
                steps: [
                    "Misture todos os ingredientes em um bowl.",
                    "Tempere com azeite e sal.",
                    "Sirva frio."
                ]
            };
        } else if (p.includes("doce") || p.includes("sobremesa")) {
            recipeData = {
                title: "Banana com Iogurte e Aveia",
                description: "Sobremesa ou lanche perfeito. Doce na medida certa.",
                tags: ["Sobremesa", "Lanche", "Rápido"],
                prep_time_minutes: 5,
                servings: 1,
                ingredients: [
                    "1 unidade de banana",
                    "1 unidade de iogurte natural",
                    "30g de aveia",
                    "Canela a gosto"
                ],
                steps: [
                    "Corte a banana em rodelas.",
                    "Misture com o iogurte.",
                    "Polvilhe a aveia e a canela por cima."
                ]
            };
        } else if (p.includes("macarrão") || p.includes("massa")) {
            recipeData = {
                title: "Macarrão com Carne Moída (Bolonhesa Fit)",
                description: "Versão mais leve do clássico, com menos gordura.",
                tags: ["Massa", "Almoço", "Conforto"],
                prep_time_minutes: 30,
                servings: 1,
                ingredients: [
                    "100g de macarrão cozido",
                    "100g de carne moída refogada",
                    "1 colher de azeite",
                    "Molho de tomate (tempero)",
                    "Manjericão a gosto"
                ],
                steps: [
                    "Cozinhe o macarrão.",
                    "Refogue a carne com o azeite e o molho.",
                    "Misture tudo e sirva."
                ]
            };
        } else {
            recipeData = {
                title: "Omelete de Queijo e Tomate",
                description: "Rápido, prático e low carb. O jantar perfeito para quem está com pressa.",
                tags: ["Ovo", "Low Carb", "Jantar"],
                prep_time_minutes: 10,
                servings: 1,
                ingredients: [
                    "2 unidades de ovo",
                    "30g de queijo",
                    "1 unidade de tomate picado",
                    "Orégano a gosto",
                    "1 colher de azeite (para untar)"
                ],
                steps: [
                    "Bata os ovos.",
                    "Misture o queijo e o tomate.",
                    "Leve à frigideira untada até firmar."
                ]
            };
        }

        // Calculate Macros dynamically based on nutrition.ts
        const { macros, ingredientsFormatted } = calculateRecipeMacros(recipeData.ingredients, recipeData.servings);

        // Get Image
        const imageUrl = getUnsplashImage(recipeData.title);

        return NextResponse.json({
            ...recipeData,
            macros, // Calculated macros
            ingredients: ingredientsFormatted, // Return nicely formatted ingredients list
            image_url: imageUrl,
            is_ai_generated: true,
            user_generated: true // Flag to distinguish in frontend if needed
        });

    } catch (error) {
        console.error("AI Generation Error:", error);
        return NextResponse.json(
            { error: "Failed to generate recipe" },
            { status: 500 }
        );
    }
}
