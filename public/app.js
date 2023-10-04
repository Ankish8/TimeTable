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
    if (!data || !data.days) return;
  
    data.days.forEach(dayData => {
      if (!dayData.day || !dayData.slots) return;
  
      dayData.slots.forEach(slot => {
        // Validate slot data
        if (!slot.time || typeof slot.time !== 'string') {
          console.error('Invalid slot data (time):', slot);
          return; // Skip this slot if time is not defined or not a string
        }
  
        // Handle empty subject
        if (!slot.subject || slot.subject.trim() === '') {
          console.warn('Empty subject:', slot);
          // If the subject is empty, you might not want to proceed further
          return;
        }
  
        const cellId = `${dayData.day}-${slot.time}`;
        const cell = document.getElementById(cellId);
        if (cell) {
          const select = cell.querySelector('select');
          if (select) {
            select.value = slot.subject; // Assign value only if subject is not empty
  
            // hide the select box and display the subject and faculty in the required format
            select.style.display = 'none';
            const displayDiv = document.createElement('div');
            displayDiv.innerHTML = '<strong>' + slot.faculty + '</strong><br>' + slot.subject;
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
    displayDiv.innerHTML = '<strong>' + subjectData[selectedSubject] + '</strong><br>' + selectedSubject;
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