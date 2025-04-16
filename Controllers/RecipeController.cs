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
                Categories = allCategories,
                Created_at = DateTime.Now
            };
            Context.Recipes.Add(recipe);
            await Context.SaveChangesAsync();
            return Ok(recipe.Title);
        }
        [Route("preuzmiRecepte")]
        [HttpGet]
        public async Task<ActionResult> preuzmiRecepte([FromQuery] List<string> categories, [FromQuery] List<string> ingredients)
        {
            var query = Context.Recipes
                .Include(r => r.Categories)
                .Include(r => r.Ingredients)
                .AsQueryable();
            if (categories != null && categories.Any())
            {
                query = query.Where(r => r.Categories.Any(c => categories.Contains(c.Name)));
            }
            if (ingredients != null && ingredients.Any())
            {
                query = query.Where(r => r.Ingredients.Any(i => ingredients.Contains(i.Name)));
            }

            var result = await query.ToListAsync();
            return Ok(result);
        }
    }
}
