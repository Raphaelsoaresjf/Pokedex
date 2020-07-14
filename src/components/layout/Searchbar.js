import React, { Component } from 'react'

class SearchBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: ''
    }
  }

  handleSearch (e) {
    this.setState({ username: e.target.value })
  }

  handleGoClick () {
    if (!this.props.github.isFetchingUser) {
      this.props.actions.fetchUser(this.state)
    }
  }

  render () {
    return (
      <div className='searchbar-container'>
            <form class="form-inline searchBar">
            <input class="form-control form-control-sm mr-3 w-75" type="text" placeholder="Search Pokemon"
                aria-label="Search" />
            <i class="fas fa-search" aria-hidden="true"></i>
            </form>
      </div>
    )
  }
}

export default SearchBar