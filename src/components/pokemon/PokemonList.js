import React, {Component} from 'react';
import axios from 'axios';

import PokemonCard from './PokemonCard';
import Pagination from '../layout/Pagination';
import Searchbar from '../layout/Searchbar';

export default class PokemonList extends Component {

    state = {
        url: "https://pokeapi.co/api/v2/pokemon?limit=25",
        pokemon: null,
        currentPagination: 1,
        searchBar: '',
        maxItem: 1
    };

    async componentDidMount() {
        const res = await axios.get(this.state.url);
        this.setState({ pokemon: res.data['results'], maxItem: Math.ceil(res.data['results'].length / 12) });
    }

    renderPagination = () => {
        if (this.state.pokemon != null) {
            return (
            <div className="mx-auto col-md-5">
                <Pagination maxItem={this.state.maxItem} setPage={this.setPage} />
            </div>
            )
        }
    }

    setPage = (page) => {
        this.setState({currentPagination: page})
    }

    calculatePageMin = () => {
        return parseInt(this.state.currentPagination === 1 ? 0 : ((this.state.currentPagination - 1) * 12));
    }

    calculatePageMax = () => {
        return parseInt(this.state.currentPagination === 1 ? 12 : this.state.currentPagination * 12);
    }

    handleSearch = (e) => {
        this.setState({ searchBar: e.target.value })
    }

    renderItem = () => {
        const {searchBar} = this.state;

        if (searchBar.length > 0) {
            const array = this.state.pokemon.filter(f => f.name.includes(searchBar.toLowerCase()));

            setTimeout(() => {
                this.setState({maxItem: Math.ceil(array.length / 12), currentPagination: 1})
            }, 50);

            return array.slice(this.calculatePageMin(), this.calculatePageMax()).map(pokemon => (
                <PokemonCard
                key={pokemon.name}
                name={pokemon.name}
                url={pokemon.url}
            />
            ));
        } else {
            if (searchBar.length === 0) {
                setTimeout(() => {
                    this.setState({maxItem: Math.ceil(this.state.pokemon .length / 12), currentPagination: 1})
                }, 50);
            }
            
            return this.state.pokemon.slice(this.calculatePageMin(), this.calculatePageMax()).map(pokemon => (
                <PokemonCard
                    key={pokemon.name}
                    name={pokemon.name}
                    url={pokemon.url}
                />
            ))
        }
    }

    render(){
        return (
            <div className="container App">
                <div className="row">
                    <div className="dexTitle col-md-9 col-12">Pokedex</div>
                    <div className="float-right" style={{alignSelf: 'center'}}><Searchbar handleSearch={this.handleSearch} searchBar={this.state.searchBar}/></div>
                </div>
                <React.Fragment>
                    {this.state.pokemon ? (
                        <div className="row">
                            {this.renderItem()}
                        </div>
                    ) : (
                        <h1>Carregando Pokemons</h1>
                    )}     
                </React.Fragment>
                {this.renderPagination()}
            </div>
        );
    }
}
