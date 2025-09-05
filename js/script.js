console.log("✅ script.js loaded");

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("forminput");
  
  // Add event listener to the form
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // ✅ stop page reload
    addTodo();              // run the add-task function
  });
  
  // Add event listeners for other buttons
  const filterBtn = document.getElementById("filter");
  const deleteAllBtn = document.getElementById("delete");
  
  if (filterBtn) {
    filterBtn.addEventListener("click", filterTodos);
  }
  
  if (deleteAllBtn) {
    deleteAllBtn.addEventListener("click", deleteAllTodos);
  }
});

function addTodo() {
  // Grab references to the inputs and table body
  const todoInput = document.getElementById('todo');
  const waktuInput = document.getElementById('waktu');
  const todoList = document.getElementById('table-body');

  // Get the actual values the user typed/selected
  const taskText = todoInput.value.trim();
  const dueDate = waktuInput.value;

  // Validation - make sure both fields are filled
  if (!taskText || !dueDate) {
    alert("Please fill in both task and due date!");
    return;
  }

  // Remove the "No Task Found" message if it exists
  const noTaskRow = todoList.querySelector('td[colspan="4"]');
  if (noTaskRow) {
    noTaskRow.parentElement.remove();
  }

  // Create a new table row
  const tr = document.createElement("tr");

  // --- Column 1: Task ---
  const tdTask = document.createElement("td");
  tdTask.textContent = taskText;
  tr.appendChild(tdTask);

  // --- Column 2: Due Date ---
  const tdDate = document.createElement("td");
  tdDate.textContent = new Date(dueDate).toLocaleDateString();
  tr.appendChild(tdDate);

  // --- Column 3: Status ---
  const tdStatus = document.createElement("td");
  const statusSpan = document.createElement("span");
  statusSpan.textContent = "Pending";
  statusSpan.style.cursor = "pointer";
  statusSpan.addEventListener("click", () => toggleStatus(statusSpan));
  tdStatus.appendChild(statusSpan);
  tr.appendChild(tdStatus);

  // --- Column 4: Actions (Delete button) ---
  const tdActions = document.createElement("td");
  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.style.cursor = "pointer";
  delBtn.addEventListener("click", () => {
    tr.remove();
    // If no tasks left, show "No Task Found" message
    checkIfEmpty();
  });
  tdActions.appendChild(delBtn);
  tr.appendChild(tdActions);

  // Finally, add the row to the table body
  todoList.appendChild(tr);

  // Clear the input boxes so the user can type a new one
  todoInput.value = "";
  waktuInput.value = "";
}

function toggleStatus(statusElement) {
  if (statusElement.textContent === "Pending") {
    statusElement.textContent = "Completed";
    statusElement.style.color = "green";
  } else {
    statusElement.textContent = "Pending";
    statusElement.style.color = "";
  }
}

function filterTodos() {
  const todoList = document.getElementById('table-body');
  const rows = todoList.querySelectorAll('tr');
  
  // Simple filter toggle between All and Pending
  const filterBtn = document.getElementById("filter");
  const isShowingAll = filterBtn.textContent === "Show All";
  
  rows.forEach(row => {
    const statusCell = row.querySelector('td:nth-child(3)');
    if (statusCell && !statusCell.hasAttribute('colspan')) {
      const status = statusCell.textContent.trim();
      
      if (isShowingAll) {
        row.style.display = '';
        filterBtn.textContent = "Filter";
      } else {
        if (status === "Completed") {
          row.style.display = 'none';
        } else {
          row.style.display = '';
        }
        filterBtn.textContent = "Show All";
      }
    }
  });
}

function deleteAllTodos() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    const todoList = document.getElementById('table-body');
    todoList.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; padding: 40px; color: #94a3b8;">
          No Task Found
        </td>
      </tr>
    `;
  }
}

function checkIfEmpty() {
  const todoList = document.getElementById('table-body');
  const rows = todoList.querySelectorAll('tr');
  
  if (rows.length === 0) {
    todoList.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; padding: 40px; color: #94a3b8;">
          No Task Found
        </td>
      </tr>
    `;
  }
}