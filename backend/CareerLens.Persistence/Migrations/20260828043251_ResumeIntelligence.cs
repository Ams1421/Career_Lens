using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CareerLens.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ResumeIntelligence : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "KeywordMatch",
                table: "Resumes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "MissingSkills",
                table: "Resumes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SectionScores",
                table: "Resumes",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "KeywordMatch",
                table: "Resumes");

            migrationBuilder.DropColumn(
                name: "MissingSkills",
                table: "Resumes");

            migrationBuilder.DropColumn(
                name: "SectionScores",
                table: "Resumes");
        }
    }
}
