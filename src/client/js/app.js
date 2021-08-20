
  // Event listener to add function to existing HTML DOM element
  //document.getElementById('generate').addEventListener('click', handleSubmit);
  let myData = {};
  const printButton = document.querySelector("#print");
  // print button
  if(printButton){
      printButton.addEventListener('click', function (e) {
          //window.print();
          var prtContent = document.getElementById("my_trips");
          var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
          WinPrint.document.write(prtContent.innerHTML);
          WinPrint.document.close();
          WinPrint.setTimeout(function(){
              WinPrint.focus();
              WinPrint.print();
              WinPrint.close();
            }, 1000);
          //location.reload();
      });
  }
  // delete button
  const deleteButton = document.querySelector("#delete");
  if(deleteButton){
      deleteButton.addEventListener('click', function (e) {
          form.reset();
          result.classList.add("invisible");
          location.reload();
      });
  }

  const saveButton = document.querySelector("#save");
  if (saveButton) {
      saveButton.addEventListener('click', () => {
      if (document.getElementsByClassName('check_content').innerHTML !==" ") {
        let savedTrips = JSON.parse(localStorage.getItem('myTrips')) || [];
        savedTrips.push({
          destination: myData.destination,
          departure: myData.formattedDate,
          days: myData.daysUntilTrip,
          summary: myData.summary,
          highTemp: myData.highTemp,
          lowTemp: myData.lowTemp,
          photo: myData.photoUrl,
          contryCode: myData.contryCode,
          icon: myData.icon,
        })
        localStorage.setItem('myTrips', JSON.stringify(savedTrips));
        console.log("Data Saved To Local Storage Successfully")
        buildTripsList();
      } else {
        alert('Please plan for a trip first!')
      }
    });
  }

  // Build The List With The Saved Trips
  const buildTripsList = () => {
      const fragment = document.createDocumentFragment();
      const container = document.getElementById('recent_trips');
      let existingTrips = JSON.parse(localStorage.getItem('myTrips')) || [];
      const trips_bundeller = document.getElementById('trips_bundeller');
      if (trips_bundeller) {
          trips_bundeller.remove();
        if (existingTrips.length) {
          const trips_bundeller = document.createElement('div');
          trips_bundeller.setAttribute('id', 'trips_bundeller');
          existingTrips.forEach((trip, index) => {
              
              const savedtrip = document.createElement('div');
              savedtrip.classList.add('saved_trips');
              //savedtrip.setAttribute('id', 'div1');

              const count = document.createElement('div');
              count.innerHTML = index + 1;
              savedtrip.appendChild(count);

              const figure = document.createElement('figure');
              figure.classList.add('trip_img');
              const img = document.createElement('img');
              img.src = trip.photo;
              figure.appendChild(img);
              savedtrip.appendChild(figure);

              const info1 = document.createElement('div');
              info1.classList.add('trip_info1');
              const label1 = document.createElement('label');
              label1.innerHTML = `-Destination: <span class="colorMark"> <span class="colorMark">${trip.destination}</span>`;
              const label2 = document.createElement('label');
              label2.innerHTML = `-Date: <span class="colorMark">${trip.departure}</span>`;
              const label3 = document.createElement('label');
              label3.innerHTML = `-Remaining dayes: <span class="colorMark">${trip.days}</span>`;
              info1.appendChild(label1);
              const lineBreak1 = document.createElement('br');
              info1.appendChild(lineBreak1);
              info1.appendChild(label2);
              const lineBreak2 = document.createElement('br');
              info1.appendChild(lineBreak2);
              info1.appendChild(label3);
              const lineBreak3 = document.createElement('br');
              info1.appendChild(lineBreak3);
              savedtrip.appendChild(info1);

              const info2 = document.createElement('div');
              info2.classList.add('trip_info2');
              const label4 = document.createElement('label');
              label4.innerHTML = `-Weather: <span class="colorMark">${trip.summary}</span>`;
              const label5 = document.createElement('label');
              label5.innerHTML = `-High: <span class="colorMark">${trip.highTemp}</span>`;
              const label6 = document.createElement('label');
              label6.innerHTML = `-Low: <span class="colorMark">${trip.lowTemp}</span>`;
              info2.appendChild(label4);
              const lineBreak4 = document.createElement('br');
              info2.appendChild(lineBreak4);
              info2.appendChild(label5);
              const lineBreak5 = document.createElement('br');
              info2.appendChild(lineBreak5);
              info2.appendChild(label6);
              const lineBreak6 = document.createElement('br');
              info2.appendChild(lineBreak6);
              savedtrip.appendChild(info2);


              trips_bundeller.appendChild(savedtrip);
              fragment.appendChild(trips_bundeller);

          });
    
        } else {
          const trips_bundeller = document.createElement('div');
          trips_bundeller.setAttribute('id', 'trips_bundeller');
          const count = document.createElement('p');
          count.innerHTML = 'You have no trips saved';
          trips_bundeller.appendChild(count);
          fragment.appendChild(trips_bundeller);
        }
      }
      if (container)
        container.appendChild(fragment);
    }


// Function to POST data
        // https://travel-planner-0.herokuapp.com/
        // http://localhost:7000
async function postFormData(data = {}) {
        const response = await fetch(`https://travel-planner-0.herokuapp.com/destination/`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json',},
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log("error", error);
    }
}


const formatDate = (date) => {
    let d = new Date(date);    
    d = new Date(d.getTime() + d.getTimezoneOffset() * 60000);    
    let month = d.toLocaleString('default', { month: 'long' });
    let day = d.getDate();
    let year = d.getFullYear();
    let newDate = `${month}, ${day}, ${year}`;
    return newDate;
}

// Function to calculate the remaining days on the flight
const numDays = (date) => {
    //Turn departure date and current date to seconds from epoch
    const tripDateSeconds = new Date(date).getTime() / 1000;
    const todaySeconds = new Date().getTime() / 1000;
    //find the difference in seconds and divide by 86400(number of seconds in a day)
    //Then round up
    return Math.ceil((tripDateSeconds - todaySeconds) / 86400);

}

// Function to Add suitable icon denpending on the current wheather
function addIcon(icon) {
    const skycons = new Skycons({ "color": "#586f7c" });
    skycons.add("icon1", icon);
    skycons.play();
}

// Update UI 
const updateUI = (data, departure) => {
    myData = data;
    const formattedDate = formatDate(departure);
    const daysUntilTrip = numDays(departure);
    myData['formattedDate'] =  formattedDate;
    myData['daysUntilTrip'] =  daysUntilTrip;

    //addIcon(data.icon);
    result.classList.remove("invisible");
    result.scrollIntoView({ behavior: "smooth" });
    
    document.querySelector("#city").innerHTML = data.destination;
    document.querySelector("#contry-code").innerHTML = data.contryCode;
    document.querySelector("#date").innerHTML = formattedDate;
    document.querySelector("#days").innerHTML = daysUntilTrip + " ";
    document.querySelector("#temp_high").innerHTML = data.highTemp + '\u00B0' + 'C .'
    document.querySelector("#temp_low").innerHTML = data.lowTemp + '\u00B0' + 'C .'
    document.querySelector("#summary").innerHTML = data.summary;
    document.getElementById('results-picture').innerHTML = `<img alt="destination image" src=${data.photoUrl}>`;
    //document.querySelector("#icon1").innerHTML = data.icon;
    // to convert from F to Celcius
    //((data.highTemp - 32)*(5/9)).toFixed(2)
}

  
// Function to handel submitted data
function handleSubmit(e) {
    e.preventDefault();
    //retrieve values from form
    let leavingFrom = document.getElementById('leavingFrom').value;
    let destination = document.getElementById('destination').value;
    let departure = document.getElementById('departure').value;
    Client.checkInput(leavingFrom, destination);
    postFormData({ destination: destination, departure: departure })
        .then((data) => {
            updateUI(data, departure);
        })
}


(() => { buildTripsList(); })();
export { handleSubmit }


