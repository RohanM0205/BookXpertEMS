using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookXpertAssignment.Migrations
{
    /// <inheritdoc />
    public partial class SeedEmployees : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Employees",
                keyColumn: "Id",
                keyValue: 1,
                column: "Name",
                value: "John Doe");

            migrationBuilder.UpdateData(
                table: "Employees",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Name", "Salary" },
                values: new object[] { "Jane Smith", 65000m });

            migrationBuilder.InsertData(
                table: "Employees",
                columns: new[] { "Id", "Department", "Name", "Salary" },
                values: new object[] { 3, "Finance", "Mike Johnson", 70000m });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Employees",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.UpdateData(
                table: "Employees",
                keyColumn: "Id",
                keyValue: 1,
                column: "Name",
                value: "John");

            migrationBuilder.UpdateData(
                table: "Employees",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Name", "Salary" },
                values: new object[] { "Jane", 70000m });
        }
    }
}
