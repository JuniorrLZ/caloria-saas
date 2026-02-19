import { NextResponse } from "next/server";

// Curated Unsplash Images for consistent quality without API Key
const FOOD_IMAGES: Record<string, string[]> = {
    "chicken": [
        "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1614055627253-bfa286390a3c?auto=format&fit=crop&w=800&q=80", // Pollo a la brasa style
        "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80", // Grilled chicken
    ],
    "beef": [
        "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&w=800&q=80", // Steak with herbs
    ],
    "pork": [
        "https://images.unsplash.com/photo-1602494191376-7c60d84c0a52?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1624838644385-d8aa1368fc33?auto=format&fit=crop&w=800&q=80", // Ribs
    ],
    "fish": [
        "https://images.unsplash.com/photo-1519708227418-c8fd9a3a2720?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1534948216015-843143f7aa67?auto=format&fit=crop&w=800&q=80", // Shrimp
        "https://images.unsplash.com/photo-1535568556730-1c39aca86ce3?auto=format&fit=crop&w=800&q=80", // Salmon fillet
    ],
    "vegan": [
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80", // Salad
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80", // Green salad
        "https://images.unsplash.com/photo-1543339308-43e59f6b73a6?auto=format&fit=crop&w=800&q=80", // Tofu bowl
    ],
    "pasta": [
        "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80", // Pasta
        "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=800&q=80", // Pasta tomato
        "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=800&q=80", // Carbonaraish
    ],
    "breakfast": [
        "https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&w=800&q=80", // Toast
        "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80", // Eggs
        "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=80", // Pancakes
    ],
    "dessert": [
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80", // Cake
        "https://images.unsplash.com/photo-1488477181946-6428a029177b?auto=format&fit=crop&w=800&q=80", // Ice cream
        "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80", // Brownie
    ],
    "soup": [
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80", // Squash soup
        "https://images.unsplash.com/photo-1543362906-ac1b452601e0?auto=format&fit=crop&w=800&q=80", // Broth
    ],
    "burger": [
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80", // Big burger
        "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80", // Cheeseburger
    ],
    "rice": [
        "https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&w=800&q=80", // Rice bowl
        "https://images.unsplash.com/photo-1539755530862-00f623c00f52?auto=format&fit=crop&w=800&q=80", // Paella-ish
    ],
    "pizza": [
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    ],
    "appetizer": [
        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80", // Fries
    ],
    "default": [
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", // Bowl
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80", // Generic Food
    ]
};

function getUnsplashImage(query: string): string {
    const q = query.toLowerCase();
    let category = "default";

    // Explicit Category Matching
    // Poultry
    if (q.includes("frango") || q.includes("galinha") || q.includes("chicken") || q.includes("peru") || q.includes("ave")) category = "chicken";
    // Red Meat
    else if (q.includes("carne") || q.includes("bife") || q.includes("beef") || q.includes("steak") || q.includes("picadinho") || q.includes("mignon")) category = "beef";
    // Pork
    else if (q.includes("porco") || q.includes("bacon") || q.includes("pork") || q.includes("costelinha") || q.includes("linguiça")) category = "pork";
    // Seafood
    else if (q.includes("peixe") || q.includes("salmão") || q.includes("atum") || q.includes("fish") || q.includes("pescada") || q.includes("tilápia") || q.includes("camarão") || q.includes("lula")) category = "fish";
    // Vegetarian / Salad
    else if (q.includes("vegan") || q.includes("vegetariano") || q.includes("salada") || q.includes("salad") || q.includes("legumes") || q.includes("tofu") || q.includes("grão-de-bico")) category = "vegan";
    // Pasta
    else if (q.includes("macarrão") || q.includes("massa") || q.includes("pasta") || q.includes("spaghetti") || q.includes("penne") || q.includes("lasanha") || q.includes("nhoque")) category = "pasta";
    // Rice
    else if (q.includes("arroz") || q.includes("risoto") || q.includes("rice") || q.includes("paella")) category = "rice";
    // Breakfast
    else if (q.includes("café") || q.includes("ovo") || q.includes("panqueca") || q.includes("breakfast") || q.includes("tapioca") || q.includes("pão") || q.includes("omelete")) category = "breakfast";
    // Dessert
    else if (q.includes("doce") || q.includes("sobremesa") || q.includes("chocolate") || q.includes("cake") || q.includes("bolo") || q.includes("fruta") || q.includes("mousse") || q.includes("sorvete")) category = "dessert";
    // Soup
    else if (q.includes("sopa") || q.includes("caldo") || q.includes("creme") || q.includes("soup")) category = "soup";
    // Burger / Sandwich
    else if (q.includes("hambúrguer") || q.includes("burger") || q.includes("sanduíche") || q.includes("lange")) category = "burger";
    // Pizza
    else if (q.includes("pizza") || q.includes("focaccia")) category = "pizza";
    // Appetizer
    else if (q.includes("frita") || q.includes("snack") || q.includes("pestisco")) category = "appetizer";

    const images = FOOD_IMAGES[category];
    return images[Math.floor(Math.random() * images.length)];
}

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        // Simulate AI Processing Delay for realism
        await new Promise(resolve => setTimeout(resolve, 1500));

        const p = prompt.toLowerCase();
        let recipeData;

        // "AI" Logic: Deterministic generation based on keywords
        if (p.includes("frango")) {
            recipeData = {
                title: "Frango Grelhado com Legumes ao Vapor",
                description: "Uma opção leve e nutritiva, perfeita para quem busca alta proteína com poucos carboidratos.",
                tags: ["Alta Proteína", "Baixo Carb", "Frango"],
                prep_time_minutes: 25,
                calories: 320,
                protein_g: 45,
                carbs_g: 12,
                fat_g: 8,
                ingredients: [
                    "2 filés de peito de frango",
                    "1 xícara de brócolis",
                    "1 cenoura média em rodelas",
                    "Suco de 1 limão",
                    "1 colher de sopa de azeite",
                    "Sal e pimenta a gosto"
                ],
                instructions: [
                    "Tempere o frango com limão, sal e pimenta.",
                    "Grelhe em frigideira antiaderente até dourar.",
                    "Cozinhe os legumes no vapor por 5 minutos.",
                    "Sirva quente regado com um fio de azeite."
                ],
                is_ai_generated: true
            };
        } else if (p.includes("vegan") || p.includes("vegetariano")) {
            recipeData = {
                title: "Bowl Vegano de Quinoa e Grão-de-Bico",
                description: "Energia pura com proteínas vegetais e gorduras boas. Ideal para o almoço.",
                tags: ["Vegano", "Saudável", "Sem Glúten"],
                prep_time_minutes: 20,
                calories: 410,
                protein_g: 18,
                carbs_g: 55,
                fat_g: 15,
                ingredients: [
                    "1 xícara de quinoa cozida",
                    "1/2 lata de grão-de-bico escorrido",
                    "1/2 abacate maduro",
                    "Tomates cereja cortados",
                    "Salsinha picada",
                    "Molho tahine para finalizar"
                ],
                instructions: [
                    "Cozinhe a quinoa conforme instruções da embalagem.",
                    "Em um bowl, disponha a quinoa, o grão-de-bico e os vegetais.",
                    "Fatie o abacate e coloque por cima.",
                    "Tempere com sal, azeite e o molho tahine."
                ],
                is_ai_generated: true
            };
        } else if (p.includes("doce") || p.includes("sobremesa")) {
            recipeData = {
                title: "Mousse Proteico de Chocolate",
                description: "Mate a vontade de doce sem sair da dieta. Rico em proteínas e super cremoso.",
                tags: ["Sobremesa", "Proteico", "Rápido"],
                prep_time_minutes: 10,
                calories: 220,
                protein_g: 25,
                carbs_g: 15,
                fat_g: 8,
                ingredients: [
                    "1 scoop de Whey Protein sabor Chocolate",
                    "1 iogurte grego natural desnatado",
                    "1 colher de cacau em pó 100%",
                    "Adoçante a gosto (opcional)",
                    "Morangos para decorar"
                ],
                instructions: [
                    "Misture o iogurte com o whey e o cacau até ficar homogêneo.",
                    "Leve à geladeira por 30 minutos para firmar.",
                    "Decore com morangos ou raspas de chocolate amargo antes de servir."
                ],
                is_ai_generated: true
            };
        } else if (p.includes("macarrão") || p.includes("massa")) {
            recipeData = {
                title: "Spaghetti Integral ao Sugo com Manjericão",
                description: "O clássico italiano em versão integral, rico em fibras e sabor.",
                tags: ["Massa", "Almoço", "Vegetariano"],
                prep_time_minutes: 30,
                calories: 450,
                protein_g: 14,
                carbs_g: 75,
                fat_g: 8,
                ingredients: [
                    "200g de espaguete integral",
                    "1 lata de tomate pelado",
                    "1 cebola pequena picada",
                    "2 dentes de alho",
                    "Manjericão fresco",
                    "1 colher de sopa de azeite"
                ],
                instructions: [
                    "Cozinhe a massa em água salgada até ficar al dente.",
                    "Refogue a cebola e o alho no azeite.",
                    "Adicione o tomate pelado e cozinhe por 10 minutos.",
                    "Misture a massa ao molho e finalize com manjericão fresco."
                ],
                is_ai_generated: true
            };
        } else {
            // Default "Surprise" Recipe
            recipeData = {
                title: "Omelete Completa de Forno",
                description: "Prática, rápida e cheia de proteínas. Ótima para qualquer hora do dia.",
                tags: ["Ovo", "Low Carb", "Prático"],
                prep_time_minutes: 15,
                calories: 280,
                protein_g: 22,
                carbs_g: 4,
                fat_g: 18,
                ingredients: [
                    "3 ovos grandes",
                    "1 fatia de queijo branco picado",
                    "Espinafre fresco picado",
                    "Tomate picado",
                    "Orégano e sal a gosto"
                ],
                instructions: [
                    "Bata os ovos com um garfo.",
                    "Misture os demais ingredientes.",
                    "Despeje em uma forma untada pequena.",
                    "Asse em forno pré-aquecido a 180°C por 15 minutos ou até firmar."
                ],
                is_ai_generated: true
            };
        }

        // Add Image - Use dynamic keyword matching from logic above in getUnsplashImage
        const imageUrl = getUnsplashImage(recipeData.title);

        return NextResponse.json({
            ...recipeData,
            image_url: imageUrl
        });

    } catch (error) {
        console.error("AI Generation Error:", error);
        return NextResponse.json(
            { error: "Failed to generate recipe" },
            { status: 500 }
        );
    }
}
