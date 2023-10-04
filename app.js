let subjectData = {};

window.onload = function () {
  fetchSubjectsAndPopulate();
  attachEventListeners();
};

function fetchSubjectsAndPopulate() {
  fetch('http://localhost:3000/api/subjects')
    .then(response => response.json())
    .then(data => {
      subjectData = data;
      populateDropdowns();

      const initialWeek = document.querySelector('.nav-link.active').innerText;
      const initialBatch = document.getElementById('batchSelect').value;
      loadTimetableData(initialWeek, initialBatch);
    })
    .catch(error => console.error('Error fetching the subjects:', error));
}

function populateDropdowns() {
  const selects = document.querySelectorAll('.subject-select');
  for (const select of selects) {
    for (const subject in subjectData) {
      const option = document.createElement('option');
      option.text = subject;
      option.value = subject;
      select.add(option);
    }
  }
}

function attachEventListeners() {
  document.getElementById('batchSelect').addEventListener('change', function () {
    const selectedWeek = document.querySelector('.nav-link.active').innerText;
    const selectedBatch = this.value;
    loadTimetableData(selectedWeek, selectedBatch);
  });

  document.querySelectorAll('.nav-link').forEach(navLink => {
    navLink.addEventListener('click', function () {
      const selectedWeek = this.innerText;
      const selectedBatch = document.getElementById('batchSelect').value;
      loadTimetableData(selectedWeek, selectedBatch);
    });
  });

  document.getElementById('removeAllButton').addEventListener('click', removeAllSubjects);

  document.getElementById('saveButton').addEventListener('click', function () {
    const selectedWeek = document.querySelector('.nav-link.active').innerText;
    const selectedBatch = document.getElementById('batchSelect').value;
    const compiledData = compileTimetableData();
    saveTimetableData(compiledData, selectedWeek, selectedBatch);
  });
}

function removeAllSubjects() {
  const subjectSelects = document.querySelectorAll('.subject-select');
  subjectSelects.forEach(select => {
    select.value = '';
  });
}

function compileTimetableData() {
  const timetableData = {}; 
  const timetableCells = document.querySelectorAll('.timetable-cell');
  
  timetableCells.forEach(cell => {
    const timeSlot = cell.getAttribute('data-time');
    const subjectSelect = cell.querySelector('.subject-select');
    const selectedSubject = subjectSelect.value;

    if (selectedSubject) {
      timetableData[timeSlot] = selectedSubject;
    }
  });
  
  return timetableData;
}

function saveTimetableData(data, week, batch) {
  fetch('http://localhost:3000/api/saveTimetable', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      week,
      batch,
      data
    })
  })
  .then(response => response.json())
  .then(() => {
    alert('Timetable saved successfully');
  })
  .catch(error => {
    console.error('Error saving timetable:', error);
  });
}

function loadTimetableData(week, batch) {
  fetch(`http://localhost:3000/api/loadTimetable?week=${week}&batch=${batch}`)
    .then(response => response.json())
    .then(data => populateTimetable(data))
    .catch(error => console.error('Error loading timetable:', error));
}

function populateTimetable(data) {
  const timetableCells = document.querySelectorAll('.timetable-cell');
  
  timetableCells.forEach(cell => {
    const timeSlot = cell.getAttribute('data-time');
    const subjectSelect = cell.querySelector('.subject-select');
    
    if (data[timeSlot]) {
      subjectSelect.value = data[timeSlot];
    } else {
      subjectSelect.value = '';
    }
  });
}
