import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import Footer from '../Footer'

import ShowEachDistrictData from '../ShowEachDistrictData'
import StateTotalData from '../StateTotalData'
import ChartsData from '../ChartsData'

import './index.css'

const statesList = [
  {
    state_code: 'AN',
    state_name: 'Andaman and Nicobar Islands',
  },
  {
    state_code: 'AP',
    state_name: 'Andhra Pradesh',
  },
  {
    state_code: 'AR',
    state_name: 'Arunachal Pradesh',
  },
  {
    state_code: 'AS',
    state_name: 'Assam',
  },
  {
    state_code: 'BR',
    state_name: 'Bihar',
  },
  {
    state_code: 'CH',
    state_name: 'Chandigarh',
  },
  {
    state_code: 'CT',
    state_name: 'Chhattisgarh',
  },
  {
    state_code: 'DN',
    state_name: 'Dadra and Nagar Haveli and Daman and Diu',
  },
  {
    state_code: 'DL',
    state_name: 'Delhi',
  },
  {
    state_code: 'GA',
    state_name: 'Goa',
  },
  {
    state_code: 'GJ',
    state_name: 'Gujarat',
  },
  {
    state_code: 'HR',
    state_name: 'Haryana',
  },
  {
    state_code: 'HP',
    state_name: 'Himachal Pradesh',
  },
  {
    state_code: 'JK',
    state_name: 'Jammu and Kashmir',
  },
  {
    state_code: 'JH',
    state_name: 'Jharkhand',
  },
  {
    state_code: 'KA',
    state_name: 'Karnataka',
  },
  {
    state_code: 'KL',
    state_name: 'Kerala',
  },
  {
    state_code: 'LA',
    state_name: 'Ladakh',
  },
  {
    state_code: 'LD',
    state_name: 'Lakshadweep',
  },
  {
    state_code: 'MH',
    state_name: 'Maharashtra',
  },
  {
    state_code: 'MP',
    state_name: 'Madhya Pradesh',
  },
  {
    state_code: 'MN',
    state_name: 'Manipur',
  },
  {
    state_code: 'ML',
    state_name: 'Meghalaya',
  },
  {
    state_code: 'MZ',
    state_name: 'Mizoram',
  },
  {
    state_code: 'NL',
    state_name: 'Nagaland',
  },
  {
    state_code: 'OR',
    state_name: 'Odisha',
  },
  {
    state_code: 'PY',
    state_name: 'Puducherry',
  },
  {
    state_code: 'PB',
    state_name: 'Punjab',
  },
  {
    state_code: 'RJ',
    state_name: 'Rajasthan',
  },
  {
    state_code: 'SK',
    state_name: 'Sikkim',
  },
  {
    state_code: 'TN',
    state_name: 'Tamil Nadu',
  },
  {
    state_code: 'TG',
    state_name: 'Telangana',
  },
  {
    state_code: 'TR',
    state_name: 'Tripura',
  },
  {
    state_code: 'UP',
    state_name: 'Uttar Pradesh',
  },
  {
    state_code: 'UT',
    state_name: 'Uttarakhand',
  },
  {
    state_code: 'WB',
    state_name: 'West Bengal',
  },
]

class StateWiseCases extends Component {
  state = {
    isLoading: true,
    activeTab: true,
    category: 'Confirmed',
    dataArray: [],
    eachStateTotalData: [],
    nameOfState: '',
    stateId: '',
    stateCode: '',
    totalTestedData: 0,
    date: '',
  }

  componentDidMount() {
    this.getAllStatesData()
  }

  changeDateFormat = dateValue => {
    const lastIndexValue = dateValue.slice(dateValue.length - 1)
    switch (lastIndexValue) {
      case '1':
        return lastIndexValue.concat('st')
      case '2':
        return lastIndexValue.concat('nd')

      case '3':
        return lastIndexValue.concat('rd')
      default:
        return lastIndexValue.concat('th')
    }
  }

  getAllStatesData = async () => {
    const {match} = this.props
    const {params} = match
    const {stateCode} = params

    const apiUrl = `https://apis.ccbp.in/covid19-state-wise-data/`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    const date = new Date(data[stateCode].meta.last_updated).toLocaleDateString(
      'en-us',
      {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      },
    )
    const dateList = date.split(' ')
    const dateValue = dateList[1].replace(',', '')
    const newDateValue = this.changeDateFormat(dateValue)
    dateList[1] = newDateValue
    const resultDateValue = dateList.join(' ')

    if (response.ok) {
      const stateTastedData = data[stateCode].total.tested
      const stateObject = statesList.filter(
        each => each.state_code === stateCode,
      )
      const eachState = data[stateCode].total
      const stateName = stateObject[0].state_name
      const dateData = resultDateValue

      this.setState({
        isLoading: false,
        eachStateTotalData: eachState,
        totalTestedData: stateTastedData,
        nameOfState: stateName,
        stateId: stateCode,
        dataArray: data,
        date: dateData,
        stateCode,
      })
    } else {
      console.log('Fetch Error')
    }
  }

  onGetCategory = categoryVal => {
    this.setState({category: categoryVal, activeTab: false})
  }

  renderLoader = () => (
    <>
      <div className="loader-container" testid="stateDetailsLoader">
        <Loader type="ThreeDots" color="blue" height="50" width="50" />
      </div>
    </>
  )

  getCategoryWiseData = () => {
    const {category, stateId, dataArray} = this.state
    const districtOutput = dataArray[stateId].districts
    const distNamesList = Object.keys(districtOutput)
    const categoryLower = category.toLowerCase()

    const categoryData = distNamesList.map(element => ({
      distName: element,
      value: districtOutput[element].total[categoryLower]
        ? districtOutput[element].total[categoryLower]
        : 0,
    }))

    categoryData.sort((a, b) => b.value - a.value)

    const activeCases = distNamesList.map(element => ({
      distName: element,
      value:
        districtOutput[element].total.confirmed -
        (districtOutput[element].total.recovered +
          districtOutput[element].total.deceased)
          ? districtOutput[element].total.confirmed -
            (districtOutput[element].total.recovered +
              districtOutput[element].total.deceased)
          : 0,
    }))
    activeCases.sort((a, b) => b.value - a.value)

    if (categoryLower === 'active') {
      return activeCases
    }
    return categoryData
  }

  renderStateView = () => {
    const {
      activeTab,
      totalTestedData,
      eachStateTotalData,
      nameOfState,
      date,
      category,
      stateCode,
    } = this.state

    const catdata = this.getCategoryWiseData()

    return (
      <>
        <div className="state-name-row">
          <div className="left-container">
            <h1 className="state-title">{nameOfState}</h1>
            <p className="last-date">{`Last update on ${date}.`}</p>
          </div>
          <div className="testNo-container">
            <p className="test-title">Tested</p>
            <p className="testNo">{totalTestedData}</p>
          </div>
        </div>

        <div className="align-center-row">
          <div className="country-stats">
            <StateTotalData
              onGetCategory={this.onGetCategory}
              eachStateTotalData={eachStateTotalData}
              active={activeTab}
            />
          </div>
        </div>

        <div className="total-district-data-block">
          <h1 className={`district-heading ${category}-color`}>
            Top Districts
          </h1>
          <div className="ul-parent-list">
            <div className="district-data-ul-list">
              <ul
                className="districts-container"
                testid="topDistrictsUnorderedList"
              >
                {catdata.map(each => (
                  <ShowEachDistrictData
                    key={each.distName}
                    number={each.value}
                    name={each.distName}
                  />
                ))}
              </ul>
            </div>
          </div>

          <div className="graphs-data" testid="lineChartsContainer">
            <ChartsData stateCode={stateCode} category={category} />
          </div>
        </div>
      </>
    )
  }

  render() {
    const {isLoading} = this.state
    return (
      <>
        <Header />
        <div className="single-state-main-container">
          <div className="state-content-container">
            {isLoading ? this.renderLoader() : this.renderStateView()}
          </div>
        </div>
        <Footer />
      </>
    )
  }
}

export default StateWiseCases
