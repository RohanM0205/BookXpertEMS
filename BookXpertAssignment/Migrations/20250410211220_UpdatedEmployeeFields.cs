using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookXpertAssignment.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedEmployeeFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Department",
                table: "Employees",
                newName: "State");

            migrationBuilder.AddColumn<int>(
                name: "Age",
                table: "Employees",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateOfBirth",
                table: "Employees",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "DateOfJoin",
                table: "Employees",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Designation",
                table: "Employees",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "Employees",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Employees",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Age", "DateOfBirth", "DateOfJoin", "Designation", "Gender", "State" },
                values: new object[] { 33, new DateTime(1990, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2020, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "HR Executive", "Male", "California" });

            migrationBuilder.UpdateData(
                table: "Employees",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Age", "DateOfBirth", "DateOfJoin", "Designation", "Gender", "State" },
                values: new object[] { 35, new DateTime(1988, 9, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2019, 3, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "IT Analyst", "Female", "Texas" });

            migrationBuilder.UpdateData(
                table: "Employees",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Age", "DateOfBirth", "DateOfJoin", "Designation", "Gender", "State" },
                values: new object[] { 38, new DateTime(1985, 12, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2018, 7, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Finance Manager", "Male", "New York" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Age",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "DateOfBirth",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "DateOfJoin",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "Designation",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Employees");

            migrationBuilder.RenameColumn(
                name: "State",
                table: "Employees",
                newName: "Department");

            migrationBuilder.UpdateData(
                table: "Employees",
                keyColumn: "Id",
                keyValue: 1,
                column: "Department",
                value: "HR");

            migrationBuilder.UpdateData(
                table: "Employees",
                keyColumn: "Id",
                keyValue: 2,
                column: "Department",
                value: "IT");

            migrationBuilder.UpdateData(
                table: "Employees",
                keyColumn: "Id",
                keyValue: 3,
                column: "Department",
                value: "Finance");
        }
    }
}
