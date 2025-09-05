console.log("✅ script.js loaded");


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("forminput");
  
  
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // biar page ga reload pas submit
    addTodo();              
  });
  
  
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
  
  const todoInput = document.getElementById('todo');
  const waktuInput = document.getElementById('waktu');
  const todoList = document.getElementById('table-body');

  // dapatkan nilai dari input todolist dan waktu
  const taskText = todoInput.value.trim();
  const dueDate = waktuInput.value;

  // hapus no task found kalo ada
  const noTaskRow = todoList.querySelector('td[colspan="4"]');
  if (noTaskRow) {
    noTaskRow.parentElement.remove();
  }

  // buat baris baru untuk tabel
  const tr = document.createElement("tr");

  // Task
  const tdTask = document.createElement("td");
  tdTask.textContent = taskText;
  tr.appendChild(tdTask);

  // Due Date
  const tdDate = document.createElement("td");
  tdDate.textContent = new Date(dueDate).toLocaleDateString();
  tr.appendChild(tdDate);

  // Status
  const tdStatus = document.createElement("td");
  const statusSpan = document.createElement("span");
  statusSpan.textContent = "Pending";
  statusSpan.style.cursor = "pointer";
  statusSpan.addEventListener("click", () => toggleStatus(statusSpan));
  tdStatus.appendChild(statusSpan);
  tr.appendChild(tdStatus);

  // Actions (Delete button)
  const tdActions = document.createElement("td");
  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.style.cursor = "pointer";
  delBtn.addEventListener("click", () => {
    tr.remove();
    // jika setelah dihapus ga ada baris lagi, tampilkan no task found
    checkIfEmpty();
  });
  tdActions.appendChild(delBtn);
  tr.appendChild(tdActions);

  
  todoList.appendChild(tr);

  // hapus input setelah submit
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
  
  // fungsi toggle antara show all dan filter
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