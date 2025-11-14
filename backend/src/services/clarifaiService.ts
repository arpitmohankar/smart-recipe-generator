import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const HF_API_KEY = process.env.HF_API_KEY!;
const HF_VISION_MODEL = process.env.HF_VISION_MODEL!;
const HF_TEXT_MODEL = process.env.HF_TEXT_MODEL!;
const HF_API_BASE = process.env.HF_API_BASE!;

const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || "";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";

const TIMEOUT = Number(process.env.REQUEST_TIMEOUT_MS || 20000);

// ----------------------------
// Helper: Ingredient Cleaner
// ----------------------------
const parseIngredients = (txt: string) => {
  return txt
    .split(/[\n,:•\-]/g)
    .map(t => t.trim().toLowerCase())
    .filter(t => t.length > 1 && t.length < 40)
    .slice(0, 12);
};

// ----------------------------
// 1) HuggingFace Vision
// ----------------------------
export async function identifyIngredientsFromImage(imageBase64: string) {
  try {
    const url = `${HF_API_BASE}/${HF_VISION_MODEL}`;

    const payload = {
      inputs: {
        text: "Extract ONLY ingredient names from this image. One per line.",
        image: `data:image/jpeg;base64,${imageBase64}`
      }
    };

    const res = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      timeout: TIMEOUT
    });

    let text = "";

    if (res.data?.generated_text) text = res.data.generated_text;
    else if (Array.isArray(res.data) && res.data[0]?.generated_text)
      text = res.data[0].generated_text;
    else text = JSON.stringify(res.data).slice(0, 1000);

    const ing = parseIngredients(text);
    if (ing.length) return ing;
  } catch (e: any) {
    console.log("HF Vision error:", e?.response?.data ?? e.message);
  }

  // fallback
  return ["tomato", "onion", "garlic"];
}

// ----------------------------
// 2) DeepSeek LLM (Primary)
// ----------------------------
async function generateWithDeepSeek(prompt: string) {
  try {
    const res = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 700
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: TIMEOUT
      }
    );

    return res.data.choices?.[0]?.message?.content;
  } catch (e: any) {
    console.log("DeepSeek error:", e?.response?.data ?? e.message);
    return null;
  }
}

// ----------------------------
// 3) HuggingFace Text Fallback
// ----------------------------
async function generateWithHF(prompt: string) {
  try {
    const url = `${HF_API_BASE}/${HF_TEXT_MODEL}`;

    const res = await axios.post(
      url,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: TIMEOUT
      }
    );

    if (Array.isArray(res.data) && res.data[0]?.generated_text)
      return res.data[0].generated_text;

    if (res.data?.generated_text) return res.data.generated_text;

    return JSON.stringify(res.data).slice(0, 1000);
  } catch (e: any) {
    console.log("HF Text error:", e?.response?.data ?? e.message);
  }
}

// ----------------------------
// 4) Public Recipe Generator
// ----------------------------
export async function generateRecipeWithLLM(ingredients: string[], preferences?: string) {
  const prompt = `
Ingredients: ${ingredients.join(", ")}
${preferences ? "Preferences: " + preferences : ""}

Generate 2 detailed recipes:
- Title
- Required ingredients
- Steps
- Cooking time
- Serving size
- Calories
`.trim();

  // Try DeepSeek first
  if (DEEPSEEK_API_KEY) {
    const out = await generateWithDeepSeek(prompt);
    if (out) return out;
  }

  // fallback → HuggingFace free text model
  const fallback = await generateWithHF(prompt);
  if (fallback) return fallback;

  // Last fallback
  return "Try making a stir-fry or a simple salad with your ingredients.";
}
