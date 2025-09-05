document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("forminput");
  
  
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // menghentikan page reload
    addTodo();              
  });
  
  //Live preview environments sometimes load DOM elements at slightly different times 
  //than regular browsers. The setTimeout() ensures the buttons are fully loaded 
  // before we try to attach event listeners to them.
  //(idk how this one works yet man, Thx A.I this settimout function make my filter and delete all buttons work)
  setTimeout(() => {
    const filterBtn = document.getElementById("filter");
    const deleteAllBtn = document.getElementById("delete");
    
    if (filterBtn) {
      filterBtn.addEventListener("click", filterTodos);
    }
    
    if (deleteAllBtn) {
      deleteAllBtn.addEventListener("click", deleteAllTodos);
    }
  }, 100);
});

function addTodo() {
  // mengambil input dari user
  const todoInput = document.getElementById('todo');
  const waktuInput = document.getElementById('waktu');
  const todoList = document.getElementById('table-body');

  // mengambil value dari input
  const taskText = todoInput.value.trim();
  const dueDate = waktuInput.value;

  // menghapus pesan "No Task Found" jika ada
  const noTaskRow = todoList.querySelector('td[colspan="4"]');
  if (noTaskRow) {
    noTaskRow.parentElement.remove();
  }

  
  const allRows = todoList.querySelectorAll('tr');
  allRows.forEach(row => {
    const firstCell = row.querySelector('td');
    if (firstCell && !firstCell.hasAttribute('colspan')) {
      row.style.display = '';
    }
  });

  // membuat row baru
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

  // Actions (Delete button) ---
  const tdActions = document.createElement("td");
  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.style.cursor = "pointer";
  delBtn.addEventListener("click", () => {
    tr.remove();
    // me reset filter button ketika menghapus task
    const filterBtn = document.getElementById("filter");
    if (filterBtn) {
      filterBtn.textContent = "Filter";
    }
    // Jika tidak ada task lagi, tampilkan pesan "No Task Found"
    checkIfEmpty();
  });
  tdActions.appendChild(delBtn);
  tr.appendChild(tdActions);

  
  todoList.appendChild(tr);

  // menghapus input setelah menambahkan task
  todoInput.value = "";
  waktuInput.value = "";
  
  // mereset filter button ketika menambahkan task
  const filterBtn = document.getElementById("filter");
  if (filterBtn) {
    filterBtn.textContent = "Filter";
  }
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


let originalTaskOrder = [];

function filterTodos() {
  const todoList = document.getElementById('table-body');
  const filterBtn = document.getElementById("filter");
  const rows = todoList.querySelectorAll('tr');
  
  
  const isCurrentlySorted = filterBtn.textContent === "Show All";
  
  if (isCurrentlySorted) {
    // mengembalikan urutan task asli
    todoList.innerHTML = '';
    originalTaskOrder.forEach(task => {
      todoList.appendChild(task);
    });
    filterBtn.textContent = "Filter";
    return;
  }
  
  // mengambil semua row task termasuk tanggal
  const taskRows = [];
  rows.forEach(row => {
    const dateCell = row.querySelector('td:nth-child(2)');
    
    if (dateCell && !dateCell.hasAttribute('colspan')) {
      const dateText = dateCell.textContent.trim();
      
      const taskDate = new Date(dateText);
      taskRows.push({
        row: row,
        date: taskDate,
        dateText: dateText
      });
    }
  });
  
  if (taskRows.length === 0) {
    alert("No tasks to sort!");
    return;
  }
  
  
  originalTaskOrder = taskRows.map(task => task.row);
  
  // urutkan berdasarkan tanggal terbaru
  taskRows.sort((a, b) => b.date - a.date);
  
  
  todoList.innerHTML = '';
  taskRows.forEach(task => {
    todoList.appendChild(task.row);
  });
  
  // update button text untuk toggle
  filterBtn.textContent = "Show All";
}

function deleteAllTodos() {
  const todoList = document.getElementById('table-body');
  
  
  const allRows = todoList.querySelectorAll('tr');
  let hasRealTasks = false;
  
  allRows.forEach(row => {
    const firstCell = row.querySelector('td:first-child');
    
    if (firstCell && !firstCell.hasAttribute('colspan')) {
      hasRealTasks = true;
    }
  });
  
  if (!hasRealTasks) {
    alert("Tidak ada task yang mau dihapus");
    return;
  }
  
  if (confirm("Apakah anda yakin ingin menghapus semua task?")) {
    
    originalTaskOrder = [];
    
    todoList.innerHTML = `
      <tr data-no-task="true">
        <td colspan="4" style="text-align: center; padding: 40px; color: #94a3b8;">
          No Task Found
        </td>
      </tr>
    `;
    
    // reset filter button
    const filterBtn = document.getElementById("filter");
    if (filterBtn) {
      filterBtn.textContent = "Filter";
    }
  }
}

function checkIfEmpty() {
  const todoList = document.getElementById('table-body');
  const rows = todoList.querySelectorAll('tr');
  
  
  let hasRealTasks = false;
  rows.forEach(row => {
    const firstCell = row.querySelector('td');
    if (firstCell && !firstCell.hasAttribute('colspan')) {
      hasRealTasks = true;
    }
  });
  
  if (!hasRealTasks) {
    todoList.innerHTML = `
      <tr data-no-task="true">
        <td colspan="4" style="text-align: center; padding: 40px; color: #94a3b8;">
          No Task Found
        </td>
      </tr>
    `;
  }
}