

function compileTimetableData() {
    const data = {
        week: document.querySelector('.nav-link.active').innerText,
        batch: document.getElementById('batchSelect').value,
        days: []
    }; 
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    days.forEach(day => {
        const dayData = { day: day, slots: [] };
        const timeSlots = document.querySelectorAll(`td[id^=${day}-] .subject-select`);
        timeSlots.forEach(slot => {
          const time = slot.closest('td').id.split('-')[1] + '-' + slot.closest('td').id.split('-')[2];
          const subjectName = slot.value;

          // Handling Missing Faculty Names
          if (subjectData[subjectName] === undefined) {
              console.error('Faculty name not found for subject:', subjectName);
              // You might want to return here or handle it in another way
              // return; // Uncomment if you want to skip slots with missing faculty names
          }

          dayData.slots.push({
              time: time,
              subject: subjectName,
              faculty: subjectData[subjectName] || 'Not Available' // Default to 'Not Available' if faculty not found
          });
        });
        data.days.push(dayData);
    });
    return data;
}

function populateTimetable(data) {
    // Clear existing data first, if needed
    const allCells = document.querySelectorAll('.subject-selected');
    allCells.forEach(cell => {
        const selectElement = cell.querySelector('select');
        const displayDiv = cell.querySelector('div');
        const editIcon = cell.querySelector('.edit-icon');

        if (selectElement && displayDiv && editIcon) {
            editIcon.classList.add('hidden');
            displayDiv.remove();
            selectElement.style.display = 'inline-block';
            selectElement.value = ""; // Reset the value of the select to the default state
            cell.classList.remove('subject-selected');
        }
    });

    // Now populate with new data
    if (!data || !data.days) return;

    data.days.forEach(dayData => {
        if (!dayData.day || !dayData.slots) return;

        dayData.slots.forEach(slot => {
            // Validate slot data
            if (!slot.time || typeof slot.time !== 'string') {
                console.error('Invalid slot data (time):', slot);
                return;
            }

            // Handle empty subject
            if (!slot.subject || slot.subject.trim() === '') {
                console.warn('Empty subject:', slot);
                return;
            }

            const cellId = `${dayData.day}-${slot.time}`;
            const cell = document.getElementById(cellId);
            if (cell) {
                const select = cell.querySelector('select');
                if (select) {
                    select.value = slot.subject;

                    // hide the select box and display the subject and faculty in the required format
                    select.style.display = 'none';
                    const displayDiv = document.createElement('div');
                    displayDiv.innerHTML = '<strong>' + slot.faculty + '</strong><br><span class="course-name">' + slot.subject + '</span>';
                    cell.appendChild(displayDiv);
                    cell.classList.add('subject-selected');

                    // If there is an edit icon, display it
                    const editIcon = cell.querySelector('.edit-icon');
                    if(editIcon){
                        editIcon.classList.remove('hidden');
                    }
                }
            } else {
                console.error('Cell not found:', cellId);
            }
        });
    });
}


function setSubject(element) {
    if (!(element instanceof HTMLElement)) element = this; // Allow for being called as an event handler
    const selectedSubject = element.value;
    element.style.display = 'none'; 
    const parentCell = element.parentNode;
    const displayDiv = document.createElement('div');
    displayDiv.innerHTML = '<strong>' + subjectData[selectedSubject] + '</strong><br><span class="course-name">' + selectedSubject + '</span>';
    parentCell.appendChild(displayDiv); 
    parentCell.classList.add('subject-selected');
    const editIcon = parentCell.querySelector('.edit-icon'); 
    editIcon.classList.remove('hidden'); 
    parentCell.classList.add('editable'); // Add this line
    // saveSubject('someCellId', selectedSubject);
  }
  function removeAllSubjects() {
      const confirmation = confirm('Are you sure you want to remove all data? This cannot be undone.');
      if (!confirmation) return;
  
      // Select all cells with the 'editable-cell' class
      const allCells = document.querySelectorAll('.editable-cell');
  
      // Iterate over all cells and reset them
      allCells.forEach(cell => {
          const selectElement = cell.querySelector('select');
          const displayDiv = cell.querySelector('div');
          const editIcon = cell.querySelector('.edit-icon');
  
          // If any element is not found, log an error and return
          if (!selectElement || !displayDiv || !editIcon) {
              console.error('Select element, display div, or edit icon not found in cell:', cell);
              return;
          }
  
          editIcon.classList.add('hidden'); // Hide the edit icon
          displayDiv.remove(); // Remove the displayed subject
          selectElement.style.display = 'inline-block'; // Show the select element again
          selectElement.value = ""; // Reset the value of the select to the default state
      });
  
      // After all cells are cleared, compile the data and save it
      const compiledData = compileTimetableData();
      saveTimetableData(compiledData);
  }
  
  
  function editSubject(element) {
    const parentCell = element.parentNode;
    const selectElement = parentCell.querySelector('select');
    const displayDiv = parentCell.querySelector('div');
  
    // First, check if the elements are selected correctly
    if (!selectElement || !displayDiv) {
      console.error('Select element or display div not found in cell:', parentCell);
      return;
    }
  
    element.classList.add('hidden'); // Hide the edit icon
    displayDiv.remove(); // Remove the displayed subject
    selectElement.style.display = 'inline-block'; // Show the select element again
    selectElement.value = ""; // Reset the value of the select to the default state
  }


function saveTimetableData(data) {
    fetch('http://localhost:3000/api/timetable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const toast = document.getElementById('save-toast');
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000); // The toast will disappear after 3 seconds
        // Handle success
        // Update UI to reflect that data was saved successfully
    })
    .catch((error) => {
        console.error('Error:', error);
        // Handle error
        // Show error message to the user
    });
}
// Paste this function after your existing functions
function loadTimetableData(week, batch) {
  // Adding a loading indicator or some UI feedback here would be a good practice
  // For instance, you could use a spinner or change the cursor to 'wait'

  // Fetch timetable data based on the selected week and batch
  fetch(`http://localhost:3000/api/timetable?week=${week}&batch=${batch}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json(); // parse the JSON from the response
    })
    .then(data => {
      // Assuming the server returns an object where `data` is null or empty if there's no record
      if (!data || Object.keys(data).length === 0) {
        // Handle non-existing data here
        console.log('No data found for selected week and batch');
        // You might want to reset the timetable to default/empty state here
      } else {
        // Call the function here with fetched data to populate the timetable
        populateTimetable(data); // replace with your actual function for populating the timetable
      }
    })
    .catch(error => {
      console.error('Error fetching the timetable:', error);
      // You might want to handle UI feedback for failed request here
    })
    .finally(() => {
      // Remove loading indicator or reset UI feedback here
      // For instance, reset the cursor to 'default' or hide the spinner
    });
}

window.onload = function () {
    // Fetch subject data from the server
    fetch('http://localhost:3000/api/subjects')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        // Store fetched data in subjectData variable
        subjectData = data;
        // Populate select elements
        const selects = document.querySelectorAll('.subject-select');
        for (const select of selects) {
          for (const subject in data) {
            const option = document.createElement('option');
            option.text = subject;
            option.value = subject;
            select.add(option);
          }
        }
        
        // After subjects have been loaded, load the timetable data
        // Get the initial values for week and batch and pass to loadTimetableData function
        const initialWeek = document.querySelector('.nav-link.active').innerText; // adjust if necessary
        const initialBatch = document.getElementById('batchSelect').value; // adjust if necessary
        loadTimetableData(initialWeek, initialBatch); // calling the function to load timetable data
      })
      .catch(error => {
        console.error('Error fetching the subjects:', error);
      });
  
    // Listen for changes on the batch select dropdown
    document.getElementById('batchSelect').addEventListener('change', function() {
      // Fetch timetable data from the server for the selected week and batch
      const selectedWeek = document.querySelector('.nav-link.active').innerText;
      const selectedBatch = this.value;
      
      loadTimetableData(selectedWeek, selectedBatch); // replaced previous fetch with function call
    });
  };

let subjectData = {}; // This will hold the fetched subject data




document.getElementById('saveButton').addEventListener('click', function() {
    const compiledData = compileTimetableData();
    saveTimetableData(compiledData);
});


document.body.addEventListener('click', function(e) {
    console.log('Clicked element:', e.target);
    console.log('Closest .edit-icon:', e.target.closest('.edit-icon'));
    if(e.target.closest('.edit-icon')) {
        e.stopPropagation();
        editSubject(e.target.closest('.edit-icon'));
    }
});

document.getElementById('removeAllButton').addEventListener('click', removeAllSubjects);

// Your existing JavaScript code...

// Locate your event listeners, usually inside or after window.onload function
// Then add the following:

// Listen for changes in week tabs

function getWeekDates(weekOffset, targetId) {
  const today = new Date();
  const currentDay = today.getDay();
  const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(today);
  monday.setDate(monday.getDate() + daysToMonday + (7 * weekOffset));
  const friday = new Date(monday);
  friday.setDate(friday.getDate() + 4);

  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  const weekInfo = `Week ${weekOffset + 1}: ${monday.toLocaleDateString('en-US', options)} - ${friday.toLocaleDateString('en-US', options)}`;
  
  document.getElementById('weekInfoText').innerText = weekInfo; // Set the week info text
}

// Initially set week dates for the first tab (Week 1)
getWeekDates(0, 'week1');

// Add event listeners to the tabs to update the week info when a tab is clicked
document.getElementById('week1-tab').addEventListener('click', function() {
  getWeekDates(0, 'week1');
});

document.getElementById('week2-tab').addEventListener('click', function() {
  getWeekDates(1, 'week2');
});



document.querySelectorAll('.nav-link').forEach((tab) => {
    tab.addEventListener('click', function() {
      // Fetch timetable data for the selected week and batch
      const selectedWeek = this.innerText;
      const selectedBatch = document.getElementById('batchSelect').value;
  
      loadTimetableData(selectedWeek, selectedBatch); // function call to load timetable data
    });
  }); 
  


  // Wait for the document to be fully loaded
  document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll('.nav-link');
  
    navLinks.forEach((navLink) => {
      navLink.addEventListener('click', function(event) {
        // Remove 'active' class from all tabs
        navLinks.forEach((innerNavLink) => {
          innerNavLink.classList.remove('active');
        });
  
        // Add 'active' class to clicked tab
        event.target.classList.add('active');
      });
    });
  });
  window.jsPDF = window.jspdf.jsPDF;
  
  async function downloadPDF() {
    const table = document.querySelector('.table');
    const batchInfo = "Batch: 2022"; // Replace with dynamic batch info
    const weekInfo = "Week: 2"; // Replace with dynamic week info
    const header = "My Awesome Timetable"; // Replace with dynamic header
    
    // Convert table to canvas using html2canvas
    const canvas = await html2canvas(table);
    
    const imgData = canvas.toDataURL('image/png');
    
    // Calculate dimensions
    const imgWidth = 297;
    const pageHeight = 210;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;
    
    // Initialize jsPDF
    const pdf = new jsPDF('l', 'mm', 'a4');
    
    let position = 40; // set position for the table canvas image
  
    // Adding Header and batch, week info before adding the table image
    pdf.setFontSize(18);
    pdf.text(header, 10, 10); // (text, x, y)
    pdf.setFontSize(12);
    pdf.text(batchInfo, 10, 20);
    pdf.text(weekInfo, 10, 30);
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Add extra pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 40; // reset the position for extra pages
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
  
    // Save PDF
    pdf.save('table.pdf');
  }
  
  // Add event listener to the download button
  document.querySelector('.downloadButton').addEventListener('click', downloadPDF);
  
  function downloadCSV() {
    let csvContent = "Time"; // Start with "Time" in the first cell

    const table = document.querySelector(".table");
    const headerRow = table.querySelector("tr");
    
    // Process header row
    headerRow.querySelectorAll("th").forEach((cell, index) => {
        if (index !== 0) { // Skip the first header cell (time)
            csvContent += `,${cell.textContent.trim()} (Course Name),${cell.textContent.trim()} (Faculty Name)`;
        }
    });

    // Add line break after the header row
    csvContent += "\r\n";

    // Now process the rest of the rows
    const rows = table.querySelectorAll("tr");
    rows.forEach((row, rowIndex) => {
        if (rowIndex !== 0) {
            let rowData = [];
            row.querySelectorAll("td, th").forEach((cell, cellIndex) => {
                if (cellIndex === 0) {
                    rowData.push(cell.textContent.trim());
                } else {
                    const subjectSelected = cell.classList.contains('subject-selected');
                    if (subjectSelected) {
                        const displayDiv = cell.querySelector('div');
                        const faculty = displayDiv.querySelector('strong').textContent.trim();
                        const subject = displayDiv.querySelector('.course-name').textContent.trim();
                        rowData.push(subject);
                        rowData.push(faculty);
                    } else {
                        rowData.push("N/A", "N/A");
                    }
                }
            });
            csvContent += rowData.join(",") + "\r\n";
        }
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.setAttribute("download", "timetable.csv");
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

  // Add the click event to the download CSV button
  document.querySelector('.downloadCSVButton').addEventListener('click', downloadCSV);
  