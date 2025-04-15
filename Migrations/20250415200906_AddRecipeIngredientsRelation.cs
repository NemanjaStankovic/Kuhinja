using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kuhinja.Migrations
{
    /// <inheritdoc />
    public partial class AddRecipeIngredientsRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_IngredientRecipe_Ingredients_IngredientsId",
                table: "IngredientRecipe");

            migrationBuilder.DropForeignKey(
                name: "FK_IngredientRecipe_Recipes_RecipesId",
                table: "IngredientRecipe");

            migrationBuilder.DropPrimaryKey(
                name: "PK_IngredientRecipe",
                table: "IngredientRecipe");

            migrationBuilder.RenameTable(
                name: "IngredientRecipe",
                newName: "RecipeIngredient");

            migrationBuilder.RenameIndex(
                name: "IX_IngredientRecipe_RecipesId",
                table: "RecipeIngredient",
                newName: "IX_RecipeIngredient_RecipesId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RecipeIngredient",
                table: "RecipeIngredient",
                columns: new[] { "IngredientsId", "RecipesId" });

            migrationBuilder.AddForeignKey(
                name: "FK_RecipeIngredient_Ingredients_IngredientsId",
                table: "RecipeIngredient",
                column: "IngredientsId",
                principalTable: "Ingredients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RecipeIngredient_Recipes_RecipesId",
                table: "RecipeIngredient",
                column: "RecipesId",
                principalTable: "Recipes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RecipeIngredient_Ingredients_IngredientsId",
                table: "RecipeIngredient");

            migrationBuilder.DropForeignKey(
                name: "FK_RecipeIngredient_Recipes_RecipesId",
                table: "RecipeIngredient");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RecipeIngredient",
                table: "RecipeIngredient");

            migrationBuilder.RenameTable(
                name: "RecipeIngredient",
                newName: "IngredientRecipe");

            migrationBuilder.RenameIndex(
                name: "IX_RecipeIngredient_RecipesId",
                table: "IngredientRecipe",
                newName: "IX_IngredientRecipe_RecipesId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_IngredientRecipe",
                table: "IngredientRecipe",
                columns: new[] { "IngredientsId", "RecipesId" });

            migrationBuilder.AddForeignKey(
                name: "FK_IngredientRecipe_Ingredients_IngredientsId",
                table: "IngredientRecipe",
                column: "IngredientsId",
                principalTable: "Ingredients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_IngredientRecipe_Recipes_RecipesId",
                table: "IngredientRecipe",
                column: "RecipesId",
                principalTable: "Recipes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
