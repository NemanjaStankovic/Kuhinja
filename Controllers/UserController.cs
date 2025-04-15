using Kuhinja.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Kuhinja.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        public AppDbContext Context { get; set; }
        public UserController(AppDbContext context)
        {
            Context = context;
        }

        [Route("dodajKorisnika")]
        [HttpPost]
        public async Task<ActionResult> dodajKorisnika([FromBody]User user)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            user.createdAt = DateTime.Now;
            Context.Users.Add(user);
            await Context.SaveChangesAsync();
            return Ok(user.Name);
        }
        [Route("preuzmiKorisnika/{email}")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiKorisnika(string email)
        {
            var korisnik = await Context.Users.Where(u => u.Email == email).FirstOrDefaultAsync();
            return Ok(korisnik);
        }
        [Route("preuzmiKorisnike")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiKorisnike()
        {
            var korisnici = await Context.Users.ToListAsync();
            return Ok(korisnici);
        }
    }
}
