import React, {Component} from 'react';
import axios from 'axios';

import PokemonCard from './PokemonCard';
import Pagination from '../layout/Pagination';
import Searchbar from '../layout/Searchbar';

export default class PokemonList extends Component {

    state = {
        url: "https://pokeapi.co/api/v2/pokemon?limit=12",
        pokemon: null
    };

    async componentDidMount() {
        const res = await axios.get(this.state.url);
        this.setState({ pokemon: res.data['results'] });
    }


    render(){
        return (
            <div className="container App">
                <div className="row">
                    <div className="dexTitle col-md-9 col-12">Pokedex</div>
                    <div className="float-right" style={{alignSelf: 'center'}}><Searchbar/></div>
                </div>
                <React.Fragment>
                    {this.state.pokemon ? (
                        <div className="row">
                            {this.state.pokemon.map(pokemon => (
                                <PokemonCard
                                    key={pokemon.name}
                                    name={pokemon.name}
                                    url={pokemon.url}
                                />
                            ))}
                        </div>
                    ) : (
                        <h1>Carregando Pokemons</h1>
                    )}     
                </React.Fragment>
                <div className="mx-auto col-md-5"><Pagination /></div>
            </div>
        );
    }
}
