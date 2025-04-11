const apiUrl = "/api/Employees";
let currentPage = 1;
const pageSize = 5;
let allEmployees = [];
let filteredEmployees = [];
let sortColumn = '';
let sortDirection = 'asc';
let chartInstance = null;

document.addEventListener("DOMContentLoaded", () => {
    fetchEmployees();
    fetchStates();

    document.getElementById("dob").addEventListener("change", calculateAge);
    document.getElementById("employeeForm").addEventListener("submit", saveEmployee);
    document.getElementById("selectAll").addEventListener("change", toggleSelectAll);
});

function validateName(input) {
    let sanitized = input.value.replace(/[0-9]/g, '');
    if (input.value !== sanitized) {
        input.value = sanitized;
    }
}

function calculateAge() {
    const dob = new Date(document.getElementById("dob").value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    document.getElementById("age").value = age;
}

async function fetchStates() {
    const stateDropdown = document.getElementById("state");
    stateDropdown.innerHTML = `<option value="">Loading...</option>`;

    try {
        const res = await fetch("data/indian-states.json"); // relative to wwwroot
        const states = await res.json();

        stateDropdown.innerHTML = `<option value="">Select</option>`;
        states.forEach(state => {
            const opt = document.createElement("option");
            opt.value = state;
            opt.text = state;
            stateDropdown.appendChild(opt);
        });
    } catch (error) {
        console.error("Error loading states:", error);
        stateDropdown.innerHTML = `<option value="">Error loading states</option>`;
    }
}


async function fetchEmployees() {
    const res = await fetch(apiUrl);
    allEmployees = await res.json();
    filteredEmployees = [...allEmployees]; // copy for filtering
    renderTable();
    updateTotalSalary();
}

function renderTable() {
    const tbody = document.getElementById("employeeTableBody");
    tbody.innerHTML = "";

    const start = (currentPage - 1) * pageSize;
    const paged = filteredEmployees.slice(start, start + pageSize);

    paged.forEach(emp => {
        const row = `<tr>
      <td><input type="checkbox" class="rowCheck" data-id="${emp.id}" /></td>
      <td>${emp.name}</td>
      <td>${emp.designation}</td>
      <td>${emp.dateOfJoin?.split("T")[0]}</td>
      <td>${emp.salary}</td>
      <td>${emp.gender}</td>
      <td>${emp.state}</td>
      <td>${emp.dateOfBirth?.split("T")[0]}</td>
      <td>${calculateAgeFromDate(emp.dateOfBirth)}</td>
      <td>
        <button onclick='editEmployee(${JSON.stringify(emp)})'>Edit</button>
        <button onclick='deleteEmployee(${emp.id})'>Delete</button>
      </td>
    </tr>`;
        tbody.innerHTML += row;
    });
}


function calculateAgeFromDate(dobString) {
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    if (
        today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
    ) {
        age--;
    }
    return age;
}

function validateSalary() {
    const salary = parseFloat(document.getElementById("salary").value);
    const error = document.getElementById("salaryError");

    if (salary > 1000000) {
        error.textContent = "Salary seems too high! Please enter a realistic amount.";
        salaryInput.value = "";
        salaryInput.focus();
        return false;
    } else {
        error.textContent = "";
        return true;
    }
}

function updateTotalSalary() {
    const total = allEmployees.reduce((sum, emp) => sum + emp.salary, 0);
    document.getElementById("totalSalary").innerText = `Total Salary: ₹${total}`;
}

function clearForm() {
    document.getElementById("employeeForm").reset();
    document.getElementById("id").value = "";
    document.getElementById("age").value = "";
}

function editEmployee(emp) {
    document.getElementById("id").value = emp.id;
    document.getElementById("name").value = emp.name;
    document.getElementById("designation").value = emp.designation;
    document.getElementById("doj").value = emp.dateOfJoin?.split("T")[0];
    document.getElementById("salary").value = emp.salary;
    document.getElementById("gender").value = emp.gender;
    document.getElementById("state").value = emp.state;
    document.getElementById("dob").value = emp.dateOfBirth?.split("T")[0];
    calculateAge();
}

async function saveEmployee(e) {
    e.preventDefault();

    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const dob = document.getElementById("dob").value;
    const age = parseInt(document.getElementById("age").value);
    const salary = parseFloat(document.getElementById("salary").value);

    //Age validation
    if (isNaN(age) || age > 100) {
        alert("Invalid Age: Age exceeds average human lifespan or is not valid.");
        document.getElementById("age").focus();
        return;
    }

    //Salary validation
    if (isNaN(salary) || salary > 1000000) {
        alert("Invalid Salary: Please enter a realistic amount (under ₹10,00,000).");
        document.getElementById("salary").focus();
        return;
    }

    //Duplicate Check (name + DOB)
    if (isDuplicateEmployee(name, dob, id)) {
        alert("Duplicate Employee: An employee with the same name and DOB already exists.");
        return;
    }

    const employee = {
        name,
        designation: document.getElementById("designation").value,
        dateOfJoin: document.getElementById("doj").value,
        salary: salary,
        gender: document.getElementById("gender").value,
        state: document.getElementById("state").value,
        dateOfBirth: dob,
    };

    const method = id ? "PUT" : "POST";
    const url = id ? `${apiUrl}/${id}` : apiUrl;

    const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(id ? { ...employee, id: parseInt(id) } : employee),
    });

    if (!res.ok) {
        const errorMsg = await res.text();
        console.error("Failed to save employee:", errorMsg);
        alert("Error saving employee. Check console for details.");
        return;
    }

    clearForm();
    fetchEmployees();
}



function isDuplicateEmployee(name, dob, id) {
    return allEmployees.some(emp =>
        emp.name.toLowerCase() === name.toLowerCase() &&
        emp.dateOfBirth?.split("T")[0] === dob &&
        emp.id != id // allow editing the same record
    );
}


async function deleteEmployee(id) {
    if (confirm("Are you sure to delete this employee?")) {
        await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        fetchEmployees();
    }
}

function toggleSelectAll(source) {
    const checkboxes = document.querySelectorAll(".rowCheck");
    checkboxes.forEach(cb => cb.checked = source.checked);
}

async function deleteSelected() {
    const selected = [...document.querySelectorAll(".rowCheck:checked")].map(cb => cb.dataset.id);
    if (selected.length === 0) return alert("No employees selected.");
    if (!confirm("Are you sure to delete selected employees?")) return;

    for (const id of selected) {
        await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    }

    fetchEmployees();
}

function searchEmployees() {
    const query = document.getElementById("searchInput").value.toLowerCase().trim();

    if (query === "") {
        // if search box is cleared, reset to all employees
        filteredEmployees = [...allEmployees];
    } else {
        filteredEmployees = allEmployees.filter(emp =>
            emp.name.toLowerCase().includes(query)
        );
    }

    currentPage = 1;
    renderTable();
    updateTotalSalary();
}

function sortTable(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }

    filteredEmployees.sort((a, b) => {
        let valA = a[column];
        let valB = b[column];

        // Handle age which may not be part of original data
        if (column === "age") {
            valA = calculateAgeFromDate(a.dateOfBirth);
            valB = calculateAgeFromDate(b.dateOfBirth);
        }

        // Convert to lowercase if string
        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    currentPage = 1;
    renderTable();
}

function nextPage() {
    const totalPages = Math.ceil(allEmployees.length / pageSize);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
}

function showChart() {
    const chartContainer = document.getElementById("chartContainer");
    chartContainer.style.display = "block";
    renderChart(); 
}

function renderChart() {
    const chartType = document.getElementById("chartType").value;

    // Group by Designation and sum salary
    const designationMap = {};

    allEmployees.forEach(emp => {
        if (!designationMap[emp.designation]) {
            designationMap[emp.designation] = 0;
        }
        designationMap[emp.designation] += emp.salary;
    });

    const labels = Object.keys(designationMap);
    const data = Object.values(designationMap);

    const ctx = document.getElementById('employeeChart').getContext('2d');

    if (chartInstance) {
        chartInstance.destroy(); // destroy previous chart to avoid duplicates
    }

    chartInstance = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Salary by Designation',
                data: data,
                backgroundColor: generateColors(data.length),
                borderColor: '#333',
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: chartType !== 'bar',
                },
                title: {
                    display: true,
                    text: 'Employee Designation vs. Salary',
                }
            }
        }
    });
}
function generateColors(count) {
    const colors = [
        '#3498db', '#e74c3c', '#2ecc71', '#f39c12',
        '#9b59b6', '#1abc9c', '#34495e', '#e67e22'
    ];
    const generated = [];
    for (let i = 0; i < count; i++) {
        generated.push(colors[i % colors.length]);
    }
    return generated;
}


async function downloadPDF() {
    const { jsPDF } = window.jspdf;

    const selectedCheckboxes = document.querySelectorAll(".rowCheck:checked");

    const fullTable = document.querySelector("#employeeTable");
    const clonedTable = document.createElement("table");
    clonedTable.style.borderCollapse = "collapse";
    clonedTable.style.width = "100%";

    clonedTable.innerHTML = fullTable.querySel
    const newTbody = document.createElement("tbody");

    const rowsToInclude =
        selectedCheckboxes.length > 0
            ? [...selectedCheckboxes].map(cb => cb.closest("tr"))
            : [...fullTable.querySelectorAll("tbody tr")];

    rowsToInclude.forEach(row => {
        const clonedRow = row.cloneNode(true);

        const checkCell = clonedRow.querySelector("td input[type='checkbox']");
        if (checkCell) checkCell.parentElement.remove();

        const actionsCell = clonedRow.querySelector("td:last-child");
        if (actionsCell) actionsCell.remove();

        newTbody.appendChild(clonedRow);
    });

    clonedTable.appendChild(newTbody);

    // Add to DOM temporarily
    const tempDiv = document.createElement("div");
    tempDiv.style.padding = "20px";
    tempDiv.appendChild(clonedTable);
    document.body.appendChild(tempDiv);

    const canvas = await html2canvas(tempDiv, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("l", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth - 20;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
    pdf.save("EmployeeList.pdf");

    document.body.removeChild(tempDiv);
}


function viewReport() {
    if (filteredEmployees.length === 0) {
        alert("No employee data available to generate report.");
        return;
    }

    // Send data to the new window via localStorage
    localStorage.setItem("employeeReportData", JSON.stringify(filteredEmployees));

    const reportWindow = window.open("employee-report.html", "_blank", "width=1000,height=800");
    if (!reportWindow) {
        alert("Popup blocked! Please allow popups for this site.");
    }
}



