import {Component} from 'react'
import {Link} from 'react-router-dom'
import {ImMenu2} from 'react-icons/im'

import './index.css'

class Header extends Component {
  state = {
    isActive: false,
  }

  onChange = () => {
    this.setState(prevState => ({
      isActive: !prevState.isActive,
    }))
  }

  showToggleIcons = () => (
    <>
      <ul className="nav-item">
        <Link to="/" className="link">
          <li className="item">Home</li>
        </Link>
        <Link to="/about" className="link">
          <li className="item">About</li>
        </Link>
        <Link to="/vaccination" className="link">
          <li className="item">Vaccination</li>
        </Link>
      </ul>
    </>
  )

  render() {
    const {isActive} = this.state
    return (
      <>
        <div className="main-container">
          <div className="nav-container">
            <Link to="/" className="link">
              <h1 className="logo">
                COVID19
                <span className="india">INDIA</span>
              </h1>
            </Link>
            <ul className="nav-items">
              <Link to="/" className="link">
                <li className="item">Home</li>
              </Link>
              <Link to="/about" className="link">
                <li className="item">About</li>
              </Link>
              <Link to="/vaccination" className="link">
                <li className="item">Vaccination</li>
              </Link>
            </ul>
            <button className="button" type="submit" onClick={this.onChange}>
              <ImMenu2 />
            </button>
          </div>

          {isActive ? this.showToggleIcons() : null}
        </div>
      </>
    )
  }
}
export default Header
