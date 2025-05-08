using System.Text.Json;
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
        [Route("dodajRecept")]
        [HttpPost]
        public async Task<IActionResult> dodajRecept(
            [FromForm] string title,
            [FromForm] string instructions,
            [FromForm] IFormFile image,
            [FromForm] List<string> categories,
            [FromForm] List<string> ingredients)
        {
            var parsedIngredients = new List<IngredientDTO>();
            var parsedCategories = new List<Category>();
            foreach (var ingStr in ingredients)
            {
                try{
                    var ing = JsonSerializer.Deserialize<IngredientDTO>(ingStr);
                    if (ing != null)
                        parsedIngredients.Add(ing);
                }
                catch
                {
                    return BadRequest("Invalid ingredient format.");
                }                
            }
            foreach(var catStr in categories)
            {
                var catDTO = JsonSerializer.Deserialize<CategoryDTO>(catStr);
                try
                {
                    var cat = await Context.Categories.Where(ct => ct.Name == catDTO.Name).FirstOrDefaultAsync();
                    if (cat != null)
                    {
                        parsedCategories.Add(cat);
                    }
                }
                catch
                {
                    return BadRequest("Invalid category format.");
                }
                
            }

            //img
            var imagePath = Path.Combine("wwwroot/images", image.FileName);
            using (var stream = new FileStream(imagePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }
            var imageUrl = Path.Combine("/images", image.FileName).Replace("\\", "/"); // Use forward slashes

            var recipe = new Recipe
            {
                Title = title,
                Instructions = instructions,
                ImageUrl = imageUrl,
                UserId = 1,
                Categories = parsedCategories,
                Created_at = DateTime.Now
            };
            Context.Recipes.Add(recipe);
            await Context.SaveChangesAsync();
            foreach(var ri in parsedIngredients)
            {
                var ing = await Context.Ingredients.Where(el=>ri.Name==el.Name).FirstOrDefaultAsync();
                if(ing!=null)
                {
                   var recIng = new RecipeIngredients
                    {
                        Recipe = recipe,
                        RecipeId = recipe.Id,
                        Amount = ri.Amount,
                        Ingredient = ing,
                        IngredientId = ing.Id,
                    };
                    Context.RecipeIngredients.Add(recIng); 
                }
            }
            await Context.SaveChangesAsync();
            return Ok(new {success=true, message="Recipe uploaded sucessfully."});
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
