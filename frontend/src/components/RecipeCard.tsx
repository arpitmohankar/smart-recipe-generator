/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Stack,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";

import {
  AccessTime as TimeIcon,
  ContentCopy as CopyIcon,
  Whatshot as NutritionIcon,
  ShoppingBasket as IngredientsIcon,
  ListAlt as StepsIcon,
} from "@mui/icons-material";

interface RecipeCardProps {
  title: string;
  ingredients: string[];
  extraIngredients?: string[];
  steps: string[];
  cookingTime?: string;
  nutrition?: string;
}

const RecipeCard = ({
  title,
  ingredients,
  extraIngredients = [],
  steps,
  cookingTime = "N/A",
  nutrition = "N/A",
}: RecipeCardProps) => {
  const handleCopy = () => {
    const text = `
${title}

Ingredients:
${ingredients.join("\n")}

Additional Ingredients:
${extraIngredients.join("\n")}

Steps:
${steps.join("\n")}

Cooking Time: ${cookingTime}
Nutrition: ${nutrition}
    `;
    navigator.clipboard.writeText(text);
  };

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        bgcolor: "background.paper",
        p: 1,
      }}
    >
      <CardContent>
        {/* Title */}
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {title}
        </Typography>

        {/* Cooking Time */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <TimeIcon sx={{ fontSize: 20, color: "primary.main" }} />
          <Typography color="text.secondary">{cookingTime}</Typography>
        </Stack>

        {/* Ingredients */}
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IngredientsIcon sx={{ fontSize: 20, color: "primary.main" }} />
            <Typography fontWeight="600">Ingredients</Typography>
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {ingredients.map((ing, index) => (
              <Chip key={index} label={ ing } size="small" color="primary" />
            ))}
          </Stack>
        </Stack>

        {/* Extra Ingredients */}
        {extraIngredients.length > 0 && (
          <Stack spacing={1} sx={{ mb: 2 }}>
            <Typography fontWeight="600">Additional Ingredients</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {extraIngredients.map((ing, index) => (
                <Chip key={index} label={ing} size="small" variant="outlined" />
              ))}
            </Stack>
          </Stack>
        )}

        {/* Divider */}
        <Divider sx={{ my: 2 }} />

        {/* Steps */}
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <StepsIcon sx={{ fontSize: 20, color: "primary.main" }} />
            <Typography fontWeight="600">Steps</Typography>
          </Stack>
          {steps.map((step, index) => (
            <Typography key={index} variant="body2" sx={{ pl: 1 }}>
              🔹 {step}
            </Typography>
          ))}
        </Stack>

        {/* Nutrition */}
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" alignItems="center" spacing={1}>
          <NutritionIcon sx={{ fontSize: 20, color: "primary.main" }} />
          <Typography fontWeight="600">Nutrition</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {nutrition}
        </Typography>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Tooltip title="Copy Recipe">
          <IconButton onClick={handleCopy}>
            <CopyIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default RecipeCard;
