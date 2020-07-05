const fourSQClientID = 'CRSKEDVVUMFVQG4DEUTMNL1PXPXIRZ33GX4HS43AJHRDLZI5'
const fourSQclientSecret = 'OUCMLRN5AMDOO1UIATTFQVZYBVYCWYV53OLM54N0ERO25OUM'
const fourSQbaseURL = 'https://api.foursquare.com/'
const fourSQVenuePath = 'v2/venues/'
const fourSQPathCat = '/categories?'
const urlFourSQClientInfo = `client_id=${fourSQClientID}&client_secret=${fourSQclientSecret}&v=20200203`

const fourSQMainURL = fourSQbaseURL + fourSQVenuePath
document.getElementById('cityName').value = "Irvine"

const activityArtsAndEntertainmentId = '4d4b7104d754a06370d81259'
const activityEventId = '4d4b7105d754a06373d81259'
const activityShopAndService = '4d4b7105d754a06378d81259'
const activityOutdoorsAndRecreation = '4d4b7105d754a06377d81259'
const foodSection = '4d4b7105d754a06374d81259'
const travelAndTransport = '4d4b7105d754a06379d81259'

const fourSQCatURL = fourSQMainURL + fourSQPathCat + `id=${activityArtsAndEntertainmentId}&` + urlFourSQClientInfo

let fiveDayForecast
let fiveDay = []
let browserGeolocation = ''
let venueItems = []
let venueWatchList = []
let geoCode = localStorage.getItem('geoCode') || '33.68687203696294,-117.788172854784'
let selectArtsAndEntertainment = document.getElementById('mArtsAndEntertainment')
let selectEvents = document.getElementById('mEvents')
let selectShopAndService = document.getElementById('mShopAndService')
let selectOutdoorsAndRecreation = document.getElementById('mOutdoorsAndRecreation')
let selectFoodOptions = document.getElementById('mFoodOptions')
let selectTravelAndTransport = document.getElementById('mTravelAndTransport')

let resultSummary = document.getElementById('resultSummary')

const fourSQGeo = () => {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(fourSQGeoStore)
  } else {
    //Defaults to Irvine
    browserGeolocation = '33.68687203696294,-117.788172854784'
  }
}
const fourSQGeoStore = () => {
  browserGeolocation = `${position.coords.latitude},${position.coords.longitude}`
}

document.addEventListener('DOMContentLoaded', function () {
  let elems = document.querySelectorAll('.dropdown-trigger');
  let instances = M.Dropdown.init(elems, {});

  let select = document.querySelectorAll('select');
  let selectInstances = M.FormSelect.init(select, {});
  let collapsible = document.querySelectorAll('.collapsible');
  let collapsibleInstances = M.Collapsible.init(collapsible, {});

  var dateChooser = document.querySelectorAll('.datepicker');
  var dateInstances = M.Datepicker.init(dateChooser, {});

});

const searchItem = () => {

  let instanceArtsAndEntertainment = M.FormSelect.getInstance(selectArtsAndEntertainment);
  let ArtsAndEntertainmentIds = instanceArtsAndEntertainment.getSelectedValues()

  let instanceEvents = M.FormSelect.getInstance(selectEvents)
  let EventsIds = instanceEvents.getSelectedValues()

  let instanceShopAndService = M.FormSelect.getInstance(selectShopAndService);
  let ShopAndServiceIds = instanceShopAndService.getSelectedValues()

  let instanceOutdoorsAndRecreation = M.FormSelect.getInstance(selectOutdoorsAndRecreation)
  let OutdoorsAndRecreationIds = instanceOutdoorsAndRecreation.getSelectedValues()

  let instanceTravelAndTransport = M.FormSelect.getInstance(selectTravelAndTransport)
  let TravelAndTransportIds = instanceTravelAndTransport.getSelectedValues()

  let instanceFoodOption = M.FormSelect.getInstance(selectFoodOptions);
  let foodIds = instanceFoodOption.getSelectedValues()

  let radInstance = M.FormSelect.getInstance(document.getElementById('selectRadius'))

  let rad = radInstance.el.selectedOptions[0].value

  let activitiesTargetDiv = document.getElementById('activities')
  let foodTargetDiv = document.getElementById('foodType')
  let shopAndServiceTargetDiv = document.getElementById('shopAndServicePicked')
  //Pull and Display
  if (ArtsAndEntertainmentIds.length > 0 && ArtsAndEntertainmentIds[0] !== '') {
    getVenues('Arts and Entertainment', ArtsAndEntertainmentIds, rad, 'cardsArtAndEntertainment', activitiesTargetDiv, 'activitiesPicked')
  }
  if (EventsIds.length > 0 && EventsIds[0] !== '') {
    getVenues('Events', EventsIds, rad, 'cardsEvents', activitiesTargetDiv, 'activitiesPicked')
  }
  if (OutdoorsAndRecreationIds.length > 0 && OutdoorsAndRecreationIds[0] !== '') {
    getVenues('Outdoors and Recreation', OutdoorsAndRecreationIds, rad, 'cardsOutdoorsAndRecreation', activitiesTargetDiv, 'activitiesPicked')
  }
  if (TravelAndTransportIds.length > 0 && TravelAndTransportIds[0] !== '') {
    getVenues('Travel and Transport', TravelAndTransportIds, rad, 'cardsTravelAndTransport', activitiesTargetDiv, 'activitiesPicked')
  }
  if (foodIds.length > 0 && foodIds[0] !== '') {
    getVenues('Food Options', foodIds, rad, 'cardsFoodOptions', foodTargetDiv, 'foodTypePicked')
  }
  if (ShopAndServiceIds.length > 0 && ShopAndServiceIds[0] !== '') {
    getVenues('Shops And Services', ShopAndServiceIds, rad, 'cardsShopAndService', activitiesTargetDiv, 'activitiesPicked')
  }

}
//  let instanceShopAndService = M.FormSelect.getInstance(selectShopAndService);
// let ShopAndServiceIds = instanceShopAndService.getSelectedValues()

const getVenues = (display, criteriaId, rad, divClass, resultDiv, targetList) => {

  //criteriaId comes in as an array of id's and have to convert array to string
  let categoryList = criteriaId.join()
  let category = '&categoryId=' + categoryList
  let searchURL = fourSQMainURL + 'search?ll=' + geoCode + category + '&radius=' + rad + '&' + urlFourSQClientInfo
  resultDiv.innerHTML = ''
  fetch(searchURL)
    .then(r => r.json())
    .then(data => {

      let { response } = data
      let { venues: venueArray } = response
      let div = document.createElement('div')
      div.classList.add(divClass)
      let subTitle = document.createElement('div')
      subTitle.innerHTML = `<h2>${display}</h2>`
      div.append(subTitle)

      venueArray.forEach((item) => {
        let newCard = createVenueCard(item, display, targetList, divClass)
        div.append(newCard)
      })
      resultDiv.append(div)
    }
    )
    .catch(e => console.error(e))

}

const getVenueDetails = (venueId) => {
  let venueURL = `https://api.foursquare.com/v2/venues/${venueId}?${urlFourSQClientInfo}`
  fetch(venueURL)
    .then(r => r.json())
    .then(data => {
      let shortURL = (data.response.venue.shortUrl).replace('http://', 'https://')
      window.open(shortURL, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes')
        ;

    })
    .catch(e => console.error(e))
}

//This is based off passing through a venue object from 4 square
const createVenueCard = (venueItem, display, targetList, divClass) => {
  let { id, name, location, categories, referralId, hasPerk } = venueItem

  let { address, city, state, postalCode, country, formattedAddress, lat, lng } = location
  let formattedAddressStr = ''
  formattedAddress.forEach((element) => {
    formattedAddressStr += element + '<br>'
  })
  let venueCard = document.createElement('div')
  venueCard.classList.add("venueCard")
  let venueElement = { venueId: id, name: name, formattedAddressStr: formattedAddressStr, formattedAddress: formattedAddress, heading: display, targetList: targetList, latitude: lat, longitude: lng, divClass: divClass }
  venueItems.push(venueElement)
  venueCard.innerHTML =
    `  <div class="row">
       <div class="col s12 m6">
      <div class="card blue-grey darken-1">
        <div class="card-content white-text">
          <span class="card-title">${name}</span>
          ${formattedAddressStr}
        </div>
        <div class="card-action">
          <button class="btn waves-effect waves-light addVenue" value='${id}'>Add Venue</button>
          <button class="btn waves-effect waves-light detailVenue" value='${id}'>Show Details</button>
        </div>

      </div>
    </div>
  </div>
`
  return venueCard
}

const getDropDowns = () => {
  fetch(fourSQCatURL)
    .then(r => r.json())
    .then(data => {

      let { response: anotherResponse } = data
      let { categories } = anotherResponse

      categories.forEach((element) => {
        switch (element.id) {
          case activityArtsAndEntertainmentId:
            appendToMaterialSelect(element, selectArtsAndEntertainment)
            break
          case activityEventId:
            appendToMaterialSelect(element, selectEvents)
            break
          case activityShopAndService:
            appendToMaterialSelect(element, selectShopAndService)
            break
          case activityOutdoorsAndRecreation:
            appendToMaterialSelect(element, selectOutdoorsAndRecreation)
            break
          case foodSection:
            appendToMaterialSelect(element, selectFoodOptions)
            break
          case travelAndTransport:
            appendToMaterialSelect(element, selectTravelAndTransport)
            break
        }
      })
      let select = document.querySelectorAll('select');
      let selectInstances = M.FormSelect.init(select, {});

    })
    .catch(e => console.error(e))
}

const appendToMaterialSelect = (element, dropdown) => {
  let valueId = 0
  let categoryArray = element.categories.slice();
  categoryArray.forEach((item) => {
    let option = document.createElement('option')
    option.textContent = item.name
    option.id = item.id
    option.value = item.id
    valueId++
    dropdown.append(option)
  })
}
getDropDowns()

const kelvinToF = (valNum) => {
  valNum = parseFloat(valNum);
  return (((valNum - 273.15) * 1.8) + 32).toFixed(2);
}

const searchByCity = (city, urlWeather) => {
  venueItems = []
  fetch(urlWeather)
    .then(r => r.json())
    .then(response => {
      let { coord, weather, base, main, visibility, wind, clouds, dt, sys, timezone, id, name, cod } = response
      geoCode = `${coord.lat},${coord.lon}`
      localStorage.setItem('geoCode', geoCode)
      getFiveDayForecastByCity(coord.lat, coord.lon)
    })
    .catch(e => { console.error(e) })
}

const getFiveDayForecastByCity = (lat, long) => {
  let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=3c181a9afca27b382c5754bb9706b06f`
  fetch(forecastURL)
    .then(r => r.json())
    .then(response => {

      if (response !== undefined || response != null) {
        fiveDayForecast = response
        displayForecast()
      }
    })
    .catch(e => { console.error(e) })

}

const displayForecast = () => {
  if (fiveDayForecast !== undefined) {
    fiveDay = []
    let { list: items } = fiveDayForecast
    for (let i = 0; i < items.length; i++) {
      let dayTime = items[i].dt_txt
      let currentHour = moment(dayTime).format('HH')
      // since its a 5 day hourly forecast we will look at the weather at 12noon

      if (currentHour === '12') {
        fiveDay.push(items[i])
      }

    }
    let container = document.getElementById
      ('weather')
    container.innerHTML = ""

    let cardHTML = "<div class='forecastLabel'>5-day forecast</div>: <br>"
    for (let j = 0; j < fiveDay.length; j++) {
      let newCard = renderForecastCard(fiveDay[j])
      cardHTML += newCard.innerHTML
    }
    container.innerHTML = cardHTML
  }
}

const renderForecastCard = (cardData) => {
  let newForecastCard = document.createElement('div')

  let { dt, main, weather, clouds, wind, sys, dt_txt } = cardData
  let forecastDay = moment(dt_txt).format('MM/DD/YYYY')

  newForecastCard.innerHTML = `<div class="card forecastCard">
  <div class="card-body card-text">
  <div class="card-title"><h6>${forecastDay}  </h6> <img src='https://openweathermap.org/img/wn/${weather[0].icon}@2x.png'> </div>
      <br> Temperature: ${kelvinToF(main.temp)} &#8457;
      <br>Humidity: ${main.humidity}% 
      <br>Wind Speed: ${wind.speed} MPH 
      </div>
      </div>`
  return newForecastCard
}

document.getElementById('search').addEventListener('click', event => {
  event.preventDefault()
  let city = document.getElementById('cityName').value

  if (city !== '') {
    let urlWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=3c181a9afca27b382c5754bb9706b06f`
    searchByCity(city, urlWeather)

    searchItem()
  }
})



document.addEventListener('click', event => {
  if (event.target.classList.contains('detailVenue')) {
    let detailVenueId = event.target.value
    getVenueDetails(detailVenueId)
  }

  if (event.target.classList.contains('addVenue')) {
    event.target.parentNode.parentNode.remove()
    let addVenueId = event.target.value
    let addVenue
    venueItems.forEach((element) => {
      if (element.venueId === addVenueId) {
        addVenue = element
      }
    })
    venueWatchList.push(addVenue)
    let venueElem = document.createElement('div')
    venueElem.className = 'card'
    venueElem.innerHTML = `
            <div class="card-content">
              <h3>${addVenue.name}</h3>
              <h4>${addVenue.formattedAddressStr}</h4>              
            </div>
            <div class="card-action">
              <button class="btn waves-effect waves-light removeVenue" value=${addVenue.venueId}>Remove Venue</button>
              <button class="btn waves-effect waves-light detailVenue" value='${addVenue.venueId}'>Show Details</button>
            </div>
        `
    document.getElementById(addVenue.targetList).append(venueElem)
  } else if (event.target.classList.contains('removeVenue')) {
    venueWatchList.forEach((element) => {
      if (element.venueId === event.target.value) {
        venueWatchList.pop(element)
      }
    })
    event.target.parentNode.parentNode.remove()
  }
})

document.getElementById('processVenue').addEventListener('click', event => {
  let ArtsAndEntertainment = []
  let Events = []
  let ShopsAndServices = []
  let OutdoorsAndRecreation = []
  let TravelAndTransport = []
  let FoodOptions = []
  venueWatchList.forEach((element) => {
    switch (element.heading) {
      case 'Arts and Entertainment':
        ArtsAndEntertainment.push(element)
        break
      case 'Events':
        Events.push(element)
        break
      case 'Shops And Services':
        ShopsAndServices.push(element)
        break
      case 'Outdoors and Recreation':
        OutdoorsAndRecreation.push(element)
        break
      case 'Travel and Transport':
        TravelAndTransport.push(element)
        break
      case 'Food Options':
        FoodOptions.push(element)
        break
      default:
        break
    }

  })

  resultSummary.innerHTML = ''
  let SummaryTitle = document.createElement('h1')
  SummaryTitle.textContent = 'Summary'
  SummaryTitle.classList.add('summaryTitle')
  resultSummary.append(SummaryTitle)

  if (ArtsAndEntertainment.length > 0) {
    createSummarySection(ArtsAndEntertainment, resultSummary)
  }
  if (Events.length > 0) {
    createSummarySection(Events, resultSummary)
  }
  if (ShopsAndServices.length > 0) {
    createSummarySection(ShopsAndServices, resultSummary)
  }
  if (OutdoorsAndRecreation.length > 0) {
    createSummarySection(OutdoorsAndRecreation, resultSummary)
  }
  if (TravelAndTransport.length > 0) {
    createSummarySection(TravelAndTransport, resultSummary)
  }
  if (FoodOptions.length > 0) {
    createSummarySection(FoodOptions, resultSummary)
  }

})

const createSummarySection = (arrayElement, resultSum) => {
  let newLine1 = document.createElement('br')
  resultSum.append(newLine1)
  let generalSubHead = document.createElement('div')
  generalSubHead.classList.add(arrayElement[0].divClass)
  let generalSubTitle = document.createElement('h2')
  generalSubTitle.textContent = arrayElement[0].heading
  resultSum.append(generalSubTitle)
  arrayElement.forEach((element) => {
    let newCard = addCardSummary(element)
    generalSubHead.append(newCard)
  })
  resultSum.append(generalSubHead)
}

const addCardSummary = (item) => {
  let venueCard = document.createElement('div')
  venueCard.classList.add("venueCard")
  venueCard.innerHTML =
    `  <div class="row">
       <div class="col s12 m6">
      <div class="card blue-grey darken-1">
        <div class="card-content white-text">
          <span class="card-title">${item.name}</span>
          ${item.formattedAddressStr}
        </div>
      </div>
    </div>
  </div>
`
  return venueCard
}