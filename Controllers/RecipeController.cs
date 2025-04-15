using Humanizer;
using Kuhinja.DTOs;
using Kuhinja.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Kuhinja.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RecipeController : ControllerBase
    {
        public AppDbContext Context { get; set; }
        public RecipeController(AppDbContext context)
        {
            Context = context;
        }

        [Route("dodajRecept/{ingredients}/{categories}/{email}")]
        [HttpPost]
        public async Task<ActionResult> dodajRecept([FromBody] RecipeDTO recipeDTO, string ingredients, string categories, string email)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var parsedIngredients = ingredients.Split(',').Select(p => p.Trim()).ToList();
            var existingIngredients= await Context.Ingredients.Where(e => parsedIngredients.Contains(e.Name)).ToListAsync();
            var nonExistingIngredients = parsedIngredients.Where(p => !existingIngredients.Any(c => c.Name == p)).Select(p => new Ingredient { Name = p }).ToList();
            Context.Ingredients.AddRange(nonExistingIngredients);
            var allIngredients = nonExistingIngredients.Concat(existingIngredients).ToList();

            var parsedCategories = categories.Split(',').Select(p => p.Trim()).ToList();
            var existingCategories = await Context.Categories.Where(e=> parsedCategories.Contains(e.Name)).ToListAsync();
            var nonExistingCategories = parsedCategories.Where(p => !existingCategories.Any(c => c.Name == p)).Select(p => new Category { Name = p }).ToList();
            Context.Categories.AddRange(nonExistingCategories);
            var allCategories = nonExistingCategories.Concat(existingCategories).ToList();

            var user = await Context.Users.Where(p => p.Email == email).FirstOrDefaultAsync();
            var recipe = new Recipe
            {
                Title = recipeDTO.Title,
                Instructions = recipeDTO.Instructions,
                ImageUrl = recipeDTO.ImageUrl,
                User = user,
                Ingredients = allIngredients,
                Categories = allCategories
            };
            Context.Recipes.Add(recipe);
            await Context.SaveChangesAsync();
            return Ok(recipe.Title);
        }
    }
}
