import React, { Component } from 'react'

class SearchBar extends Component {
  render () {
    return (
      <div className='searchbar-container'>
            <form class="form-inline searchBar">
            <input class="form-control form-control-sm mr-3 w-75" type="text" placeholder="Search Pokemon"
                aria-label="Search"
                value={this.props.searchBar}
                onChange={(e) => this.props.handleSearch(e)} />
            <i class="fas fa-search" aria-hidden="true"></i>
            </form>
      </div>
    )
  }
}

export default SearchBar