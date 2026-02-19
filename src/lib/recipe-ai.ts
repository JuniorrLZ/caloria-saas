import { createClient } from "@/lib/supabaseClient";

export interface RecipeDTO {
    title: string;
    description: string;
    tags: string[];
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    prep_time_min: number;
    ingredients: string[];
    steps: string[];
    image_url: string | null;
}

const MOCK_IMAGES = [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80", // Chicken
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80", // Salad
];

export async function generateRecipeFromPrompt(prompt: string): Promise<RecipeDTO> {
    // Simulate AI delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const p = prompt.toLowerCase();

    let base: RecipeDTO = {
        title: "Receita Surpresa do Chef IA",
        description: "Uma refeição deliciosa e equilibrada gerada especialmente para você.",
        tags: ["Equilibrado"],
        calories: 500,
        protein: 30,
        carbs: 50,
        fat: 20,
        prep_time_min: 30,
        ingredients: ["Sal", "Pimenta", "Azeite"],
        steps: ["Prepare os ingredientes.", "Misture tudo.", "Cozinhe por 20 minutos.", "Sirva quente."],
        image_url: MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)]
    };

    // Keyword analysis for better "mock" results
    if (p.includes("frango") || p.includes("galinha")) {
        base.title = "Frango Grelhado com Ervas Finas";
        base.description = "Peito de frango suculento marinado em limão e ervas, acompanhado de vegetais.";
        base.tags = ["Alta Proteína", "Baixo Carb", "Frango"];
        base.calories = 420;
        base.protein = 45;
        base.carbs = 10;
        base.fat = 15;
        base.ingredients = ["2 peitos de frango", "Suco de 1 limão", "1 colher de alho em pó", "Ervas finas a gosto", "Brócolis cozido para acompanhar"];
        base.steps = ["Tempere o frango com limão, alho e ervas.", "Deixe marinar por 15 minutos.", "Grelhe em fogo médio até dourar.", "Sirva com o brócolis."];
        base.image_url = MOCK_IMAGES[4];
    } else if (p.includes("vegan") || p.includes("vegetariano") || p.includes("legumes")) {
        base.title = "Bowl Vegano de Quinoa e Vegetais";
        base.description = "Uma explosão de cores e nutrientes com quinoa, abacate e gr grão-de-bico.";
        base.tags = ["Vegano", "Saudável", "Sem Glúten"];
        base.calories = 380;
        base.protein = 15;
        base.carbs = 55;
        base.fat = 12;
        base.ingredients = ["1 xícara de quinoa cozida", "1/2 abacate", "1/2 xícara de grão-de-bico", "Tomate cereja", "Molho tahine"];
        base.steps = ["Cozinhe a quinoa conforme a embalagem.", "Corte os vegetais.", "Monte o bowl com a quinoa na base.", "Adicione os toppings e finalize com o molho."];
        base.image_url = MOCK_IMAGES[5];
    } else if (p.includes("doce") || p.includes("sobremesa") || p.includes("chocolate")) {
        base.title = "Mousse Fit de Chocolate";
        base.description = "Sobremesa saudável rica em proteínas para matar a vontade de doce.";
        base.tags = ["Sobremesa", "Proteico", "Rápido"];
        base.calories = 220;
        base.protein = 12;
        base.carbs = 25;
        base.fat = 8;
        base.ingredients = ["1 scoop de Whey Protein Chocolate", "1 abacate maduro pequeno", "1 colher de cacau em pó", "Adoçante a gosto"];
        base.steps = ["Bata todos os ingredientes no liquidificador até ficar homogêneo.", "Leve à geladeira por 30 minutos.", "Sirva gelado."];
        base.image_url = MOCK_IMAGES[3];
    } else if (p.includes("macarrão") || p.includes("pasta") || p.includes("italiano")) {
        base.title = "Macarrão Integral ao Sugo";
        base.description = "Clássico italiano em versão mais saudável com massa integral.";
        base.tags = ["Massa", "Almoço", "Conforto"];
        base.calories = 450;
        base.protein = 18;
        base.carbs = 70;
        base.fat = 10;
        base.ingredients = ["200g Macarrão Integral", "3 tomates maduros", "Manjericão fresco", "1 dente de alho", "Queijo parmesão ralado"];
        base.steps = ["Cozinhe o macarrão al dente.", "Refogue o alho e tomates para fazer o molho.", "Misture a massa ao molho.", "Finalize com manjericão e queijo."];
        base.image_url = MOCK_IMAGES[1];
    }

    // Dynamic title enrichment
    if (!base.title.includes("IA")) {
        base.title += " (IA)";
    }

    return base;
}
