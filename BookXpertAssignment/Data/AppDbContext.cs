using BookXpertAssignment.Model;
using Microsoft.EntityFrameworkCore;

namespace BookXpertAssignment.Data
{
    public class BookXpertAssignmentContext : DbContext
    {
        public BookXpertAssignmentContext(DbContextOptions<BookXpertAssignmentContext> options) : base(options) { }

        public DbSet<Employee> Employees { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Employee>().HasData(
                new Employee
                {
                    Id = 1,
                    Name = "John Doe",
                    Designation = "HR Executive",
                    DateOfJoin = new DateTime(2020, 1, 10),
                    Salary = 50000,
                    Gender = "Male",
                    State = "California",
                    DateOfBirth = new DateTime(1990, 5, 15),
                    Age = 33
                },
                new Employee
                {
                    Id = 2,
                    Name = "Jane Smith",
                    Designation = "IT Analyst",
                    DateOfJoin = new DateTime(2019, 3, 22),
                    Salary = 65000,
                    Gender = "Female",
                    State = "Texas",
                    DateOfBirth = new DateTime(1988, 9, 10),
                    Age = 35
                },
                new Employee
                {
                    Id = 3,
                    Name = "Mike Johnson",
                    Designation = "Finance Manager",
                    DateOfJoin = new DateTime(2018, 7, 1),
                    Salary = 70000,
                    Gender = "Male",
                    State = "New York",
                    DateOfBirth = new DateTime(1985, 12, 3),
                    Age = 38
                }
            );
        }



    }
}
