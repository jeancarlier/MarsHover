using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MarsHoverWebApplication.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Rovers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Color = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rovers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Locations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    X = table.Column<int>(type: "int", nullable: false),
                    Y = table.Column<int>(type: "int", nullable: false),
                    HeadingTo = table.Column<int>(type: "int", nullable: false),
                    NavigationSteps = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MovimentTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MaxGridSize = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RoverId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Locations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Locations_Rovers_RoverId",
                        column: x => x.RoverId,
                        principalTable: "Rovers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Locations_RoverId",
                table: "Locations",
                column: "RoverId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Locations");

            migrationBuilder.DropTable(
                name: "Rovers");
        }
    }
}
