using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class FoodDiaryTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppUserFoodDiaries",
                columns: table => new
                {
                    AppUserFoodDiaryID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    FoodDiaryDate = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUserFoodDiaries", x => x.AppUserFoodDiaryID);
                    table.ForeignKey(
                        name: "FK_AppUserFoodDiaries_AspNetUsers_UserID",
                        column: x => x.UserID,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FoodItems",
                columns: table => new
                {
                    FoodItemID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FdcID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ServingSize = table.Column<double>(type: "float", nullable: false),
                    ServingSizeUnit = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Protein = table.Column<double>(type: "float", nullable: false),
                    ProteinUnit = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Fat = table.Column<double>(type: "float", nullable: false),
                    FatUnit = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Carb = table.Column<double>(type: "float", nullable: false),
                    CarbUnit = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Energy = table.Column<double>(type: "float", nullable: false),
                    EnergyUnit = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Sugar = table.Column<double>(type: "float", nullable: false),
                    SugarUnit = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Fiber = table.Column<double>(type: "float", nullable: false),
                    FiberUnit = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FoodItems", x => x.FoodItemID);
                });

            migrationBuilder.CreateTable(
                name: "FoodDiaryEntries",
                columns: table => new
                {
                    FoodDiaryEntryID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AppUserFoodDiaryID = table.Column<int>(type: "int", nullable: false),
                    FoodItemID = table.Column<int>(type: "int", nullable: false),
                    NumberOfServings = table.Column<double>(type: "float", nullable: false),
                    ServingType = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FoodDiaryEntries", x => x.FoodDiaryEntryID);
                    table.ForeignKey(
                        name: "FK_FoodDiaryEntries_AppUserFoodDiaries_AppUserFoodDiaryID",
                        column: x => x.AppUserFoodDiaryID,
                        principalTable: "AppUserFoodDiaries",
                        principalColumn: "AppUserFoodDiaryID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FoodDiaryEntries_FoodItems_FoodItemID",
                        column: x => x.FoodItemID,
                        principalTable: "FoodItems",
                        principalColumn: "FoodItemID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppUserFoodDiaries_UserID",
                table: "AppUserFoodDiaries",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_FoodDiaryEntries_AppUserFoodDiaryID",
                table: "FoodDiaryEntries",
                column: "AppUserFoodDiaryID");

            migrationBuilder.CreateIndex(
                name: "IX_FoodDiaryEntries_FoodItemID",
                table: "FoodDiaryEntries",
                column: "FoodItemID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FoodDiaryEntries");

            migrationBuilder.DropTable(
                name: "AppUserFoodDiaries");

            migrationBuilder.DropTable(
                name: "FoodItems");
        }
    }
}
