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
        public async Task<ActionResult> dodajRecept([FromBody] RecipeDTO recipeDTO, string ingredients, string categories, string measurements, string email)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var parsedMeasurements = measurements.Split(',').Select(p=>p.Trim()).ToList();

            var parsedIngredients = ingredients.Split(',').Select(p => p.Trim()).ToList();
            var allIngredients= await Context.Ingredients.Where(e => parsedIngredients.Contains(e.Name)).ToListAsync();
            // var nonExistingIngredients = parsedIngredients.Where(p => !existingIngredients.Any(c => c.Name == p)).Select(p => new Ingredient { Name = p }).ToList();
            //Context.Ingredients.AddRange(nonExistingIngredients);
            // var allIngredients = nonExistingIngredients.Concat(existingIngredients).ToList();

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
                Categories = allCategories,
                Created_at = DateTime.Now
            };
            Context.Recipes.Add(recipe);
            await Context.SaveChangesAsync();
            for(int i=0; i< parsedIngredients.Count; i++)
            {
                double.TryParse(parsedMeasurements[i], out double result);

                var recIng = new RecipeIngredients
                {
                    Recipe = recipe,
                    RecipeId = recipe.Id,
                    Amount = result,
                    Ingredient = allIngredients[i],
                    IngredientId = allIngredients[i].Id,
                };
                Context.RecipeIngredients.Add(recIng);
            }
            await Context.SaveChangesAsync();
            return Ok(recipe.Title);
        }
        [Route("dodajSastojak/{Name}/{unitOfM}")]
        [HttpPost]
        public async Task<ActionResult> dodajSastojak(string Name, string unitOfM)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var ing = new Ingredient
            {
                Name = Name,
                UnitOfMeassure = unitOfM,
            };
            Context.Ingredients.Add(ing);
            await Context.SaveChangesAsync();
            return Ok(ing.Name);
        }
        [Route("dodajKategoriju/{Name}/{Type}")]
        [HttpPost]
        public async Task<ActionResult> dodajKategoriju(string Name, string Type)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var cat = new Category
            {
                Name = Name,
                Type = Type,
            };
            Context.Categories.Add(cat);
            await Context.SaveChangesAsync();
            return Ok(cat.Name);
        }
        [HttpPost]
        [Route("preuzmiRecepte")]
        public async Task<ActionResult> preuzmiRecepte([FromQuery] List<string> categories, [FromBody] List<IngredientDTO>? ingredientAmounts)
        {
            var query = Context.Recipes
                .Include(r => r.Categories)
                .Include(r => r.RecipeIngredients)
                .ThenInclude(ri=> ri.Ingredient)
                .AsQueryable();
            if (categories != null && categories.Any())
            {                              //kategorije entiteta
                query = query.Where(r => r.Categories.Where(c=>categories.Contains(c.Name)).Count() == categories.Count());
            }
            if (ingredientAmounts != null && ingredientAmounts.Any())
            {
                foreach (var ingredient in ingredientAmounts)
                {
                    query = query.Where(recipe =>
                        recipe.RecipeIngredients.Any(ri =>
                            ri.Ingredient.Name == ingredient.Name &&
                            ri.Amount <= ingredient.Amount
                        )
                    );
                }
            }
            var result = await query.ToListAsync();
            return Ok(result);
        }
        [HttpGet]
        [Route("preuzmiKategorije")]
        public async Task<ActionResult<CategoriesDTO>> preuzmiKategorije()
        {
            var allCategories = await Context.Categories.ToListAsync();

            var dto = new CategoriesDTO
            {
                Time = allCategories.Where(c => c.Type == "time").ToList(),
                Portions = allCategories.Where(c => c.Type == "portions").ToList(),
                Types = allCategories.Where(c => c.Type == "types").ToList()
            };

            return Ok(dto);
        }
        [Route("preuzmiSastojke")]
        [HttpGet]
        public async Task<ActionResult> preuzmiSastojke()
        {
            var ingredients = await Context.Ingredients.ToListAsync();
            return Ok(ingredients);
        }
    }
}
