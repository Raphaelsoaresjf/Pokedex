import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

import styled from 'styled-components';
import spinner from '../pokemon/loading.svg';

const TYPE_COLORS = {
    bug: '#62D5AE',
    dark: '#1F1F1F',
    dragon: '#F16F65',
    electric: '#FFCE4B',
    fairy: '#F7A2DF',
    fighting: '#585858',
    fire: '#F16F65',
    flying: '#BCBCBC',
    ghost: '#B8B9CF',
    grass: '#62D5AE',
    ground: '#705849',
    ice: '#6D7BE3',
    normal: '#BCBCBC',
    poison: '#9F449F',
    psychic: '#F7A2DF',
    rock: '#939393',
    steel: '#E0E0E0',
    water: '#4EC6FD'
};

const Sprite = styled.img`
    width: 8em;
    height: 8em;
    display: none;
`;

const Card = styled.div`
    border-radius: 10px;
    color: white !important;
    box-shadow 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: all 0.3s cubic-bezier(0.14, 0.8, 0.25, 1);
    &:hover {
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    }
    -moz-user-select: none;
    -website-user-select: none;
    user-select: none;
    -o-user-select: none;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: black;
    &:focus,
    &:hover,
    &:visited,
    &:link,
    &:active {
        text-decoration: none;
    }

`;

export default class PokemonCard extends Component {
    state = {
        name: '',
        imageUrl: '',
        pokemonIndex: '',
        imageLoading: true,
        toManyRequests: false,
        types: [],
        frontIndex: ''
    };

    async componentDidMount() {
        const {name, url} = this.props;
        const pokemonIndex = url.split('/')[url.split('/').length - 2];
        const frontIndex = ('000' + pokemonIndex).slice(-3);
        const imageUrl = `https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${pokemonIndex}.png?raw=true`;
        
        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
        const pokemonRes = await axios.get(pokemonUrl);
        const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;
        const types = pokemonRes.data.types.map(type => type.type.name);  

        this.setState({
            name,
            imageUrl,
            pokemonIndex,
            types,
            frontIndex
        });
    }

    render(){
        return (
            <div className="col-md-4 col-sm-6 mb-5 col-6">
                <StyledLink to={`pokemon/${this.state.pokemonIndex}`}>
                    <Card className="card" style={{backgroundColor: `${TYPE_COLORS[this.state.types[0]]}`, borderColor: `${TYPE_COLORS[this.state.types[0]]}`}}>
                        <div className="col-md-12 col-sm-12" style={{ padding: '0px'}}> 
                            <div className="col-md-8 col-sm-12 float-right mt-3"> 
                                <div className="col-md-12 col-sm-12 ib cardTitle" style={{color: 'white'}}>
                                    {this.state.name
                                        .toLowerCase()
                                        .split(' ')
                                        .map(
                                            letter => letter.charAt(0).toUpperCase() + letter.substring(1)
                                        )
                                        .join(' ')
                                    }
                                </div>
                                <div className="col-md-12 col-12 ib typeFont">
                                    <div className="float-left">
                                        {this.state.types.map( type => (
                                            <span 
                                                key={type}
                                                className="badge badge-primary badge-pill mr-1"
                                                style={{
                                                    backgroundColor: `${TYPE_COLORS[type]}`,
                                                }}
                                            >
                                                {type
                                                .toLowerCase()
                                                .split(' ')
                                                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                                                .join(' ')}
                                            </span>
                                        ))}
                                    </div>              
                                </div>
                                <div className="col-md-12 col-12 ib pokeIndex">
                                    <div>
                                        #{this.state.frontIndex}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 col-8 pokePos"> 
                                {this.state.imageLoading ? (
                                    <img 
                                        src={spinner} 
                                        style={{width: '5em', height: '5em'}} 
                                        className="card-mg-top rounded mx-auto d-block mt-2"
                                    />
                                ) : null}
                                <Sprite 
                                    className="card-img-top rounded mt-2 imgPoke"
                                    onLoad={() => this.setState({imageLoading: false})}
                                    onError={() => this.setState({imageLoading: true})}
                                    src={this.state.imageUrl}
                                    style={
                                        this.state.toManyRequests ? {display: "none"} :
                                        this.state.imageLoading ? null : {display: "block"}
                                    }
                                />
                                {this.state.toManyRequests ? (<h6 className="mx-auto">
                                    <span className="badge badge-danger mt-2">Falha na Requisição</span>
                                </h6>) : null}
                            </div>
                        </div>
                    </Card>
                </StyledLink>
            </div>
        );
    }
}
