import { NextResponse } from "next/server";

// Curated Unsplash Images for consistent quality without API Key
const FOOD_IMAGES: Record<string, string[]> = {
    "chicken": [
        "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    ],
    "beef": [
        "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&w=800&q=80",
    ],
    "pork": [
        "https://images.unsplash.com/photo-1602494191376-7c60d84c0a52?auto=format&fit=crop&w=800&q=80",
    ],
    "fish": [
        "https://images.unsplash.com/photo-1519708227418-c8fd9a3a2720?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&w=800&q=80",
    ],
    "vegan": [
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80", // Salad
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80", // Green salad
    ],
    "pasta": [
        "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80", // Pasta
        "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=800&q=80", // Pasta tomato
    ],
    "breakfast": [
        "https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&w=800&q=80", // Toast
        "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80", // Eggs
    ],
    "dessert": [
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80", // Cake
        "https://images.unsplash.com/photo-1488477181946-6428a029177b?auto=format&fit=crop&w=800&q=80", // Ice cream
    ],
    "default": [
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", // Bowl
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80", // Generic Food
    ]
};

function getUnsplashImage(query: string): string {
    const q = query.toLowerCase();
    let category = "default";

    if (q.includes("frango") || q.includes("galinha") || q.includes("chicken")) category = "chicken";
    else if (q.includes("carne") || q.includes("bife") || q.includes("beef") || q.includes("steak")) category = "beef";
    else if (q.includes("porco") || q.includes("bacon") || q.includes("pork")) category = "pork";
    else if (q.includes("peixe") || q.includes("salmão") || q.includes("atum") || q.includes("fish")) category = "fish";
    else if (q.includes("vegan") || q.includes("vegetariano") || q.includes("salada") || q.includes("salad")) category = "vegan";
    else if (q.includes("macarrão") || q.includes("massa") || q.includes("pasta") || q.includes("spaghetti")) category = "pasta";
    else if (q.includes("café") || q.includes("ovo") || q.includes("panqueca") || q.includes("breakfast")) category = "breakfast";
    else if (q.includes("doce") || q.includes("sobremesa") || q.includes("chocolate") || q.includes("cake")) category = "dessert";

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

        // Add Image
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
