using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CareerLens.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddResumeAtsAnalysis : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AtsScore",
                table: "Resumes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "AtsSuggestions",
                table: "Resumes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExtractedText",
                table: "Resumes",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AtsScore",
                table: "Resumes");

            migrationBuilder.DropColumn(
                name: "AtsSuggestions",
                table: "Resumes");

            migrationBuilder.DropColumn(
                name: "ExtractedText",
                table: "Resumes");
        }
    }
}
