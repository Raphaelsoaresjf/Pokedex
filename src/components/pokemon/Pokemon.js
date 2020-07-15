import React, { Component } from 'react'
import axios from 'axios';
import { Tabs, Tab} from 'react-bootstrap';
import Arrow from './arrow.png';

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


export default class Pokemon extends Component {
    state = {
        name: '',
        pokemonIndex: '',
        imageUrl: '',
        types: [],
        description: '',
        stats: {
            hp: "",
            attack: "",
            defense: "",
            speed: "",
            specialAttack: "",
            specialDefense: ""
        },
        height: '',
        weight: '',
        eggGroup: '',
        abilities: '',
        genderRatioMale: '',
        genderRatioFemale: '',
        evs: '',
        hatchSteps: '',
        evolution: ''
    };

    async componentDidMount() {
        const {pokemonIndex} = this.props.match.params;

        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
        const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;
        const evolution = `https://pokeapi.co/api/v2/evolution-chain/${pokemonIndex}/`;

        const pokemonRes = await axios.get(pokemonUrl);
        const name = pokemonRes.data.name;
        const imageUrl = pokemonRes.data.sprites.front_default;

        let { hp, attack, defense, speed, specialAttack, specialDefense} = '';

        pokemonRes.data.stats.map(stat => {
            switch(stat.stat.name){
                case 'hp':
                    hp = stat['base_stat'];
                    break;
                case 'attack':
                    attack = stat['base_stat'];
                    break;
                case 'defense':
                    defense = stat['base_stat'];
                    break;
                case 'speed':
                    speed = stat['base_stat'];
                    break;  
                case 'special-attack':
                    specialAttack = stat['base_stat'];
                    break;
                case 'special-defense':
                    specialDefense = stat['base_stat'];
                    break; 
            }
        })

        const height = 
            Math.round((pokemonRes.data.height / 10 + 0.0001) * 100) / 100;
        
        const weight = 
            Math.round((pokemonRes.data.weight / 10 + 0.0001) * 100) / 100;

        const types = pokemonRes.data.types.map(type => type.type.name);   
        
        const abilities = pokemonRes.data.abilities.map(ability => {
            return ability.ability.name
            .toLowerCase()
            .split('-')
            .map(s => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');     
        }).join(', ');

        const evs = pokemonRes.data.stats.filter(stat => {
            if(stat.effort > 0){
                return true;
            }
            return false;
        }).map(stat => {
            return `${stat.effort} ${stat.stat.name}`
            .toLowerCase()
            .split('-')
            .map(s => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
        }).join(', ');

        await axios.get(pokemonSpeciesUrl).then(res => {
            let description = "";
            res.data.flavor_text_entries.some(flavor => {
                if (flavor.language.name === 'en') {
                    description = flavor.flavor_text;
                    return;
                }
            });

            const femaleRate = res.data['gender_rate'];
            const genderRatioFemale = 12.5 * femaleRate;
            const genderRatioMale = 12.5 * (8 - femaleRate);

            const catchRate = Math.round((100 / 255) * res.data['capture_rate']);

            const eggGroups = res.data['egg_groups']
                .map(group => {
                    return group.name
                    .toLowerCase()
                    .split('-')
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ');
            })
            .join(', ');

            const hatchSteps = 255 * (res.data['hatch_counter'] + 1);
            const frontIndex = ('000' + pokemonIndex).slice(-3);

            this.setState({
                description,
                genderRatioFemale,
                genderRatioMale,
                catchRate,
                eggGroups,
                hatchSteps,
                frontIndex
            })
        });

        this.setState({
            imageUrl,
            pokemonIndex,
            name,
            types,
            stats: {
                hp,
                attack,
                defense,
                speed,
                specialAttack,
                specialDefense
            },
            height,
            weight,
            abilities,
            evs
        })
    }
    render() {
        return (
            <div>
                <div className="card-header pokeHeader" style={{backgroundColor: `${TYPE_COLORS[this.state.types[0]]}`}}>
                    <div className="row">
                        <div className="row col-12">
                        <a href='#' style={{alignSelf: 'center', flex: '0 !important',  marginRight: '0px !important', marginLeft: 'auto'}}>
                            <img 
                                src={Arrow} 
                                style={{width: '1em', height: '1em', color: 'white'}} 
                                className=""
                            />
                        </a>
                        <div className="col-md-6 poke-title" style={{color: 'white', fontWeight: '500', marginLeft: '0px !important',  marginRight: 'auto'}}>
                                {this.state.name
                                    .toLowerCase()
                                    .split(' ')
                                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                                    .join(' ')
                                }
                            </div>
                            <div className="mx-auto col-md-6">
                                {this.state.types.map( type => (
                                    <span 
                                        key={type}
                                        className="badge badge-primary badge-pill mr-1"
                                        style={{
                                            backgroundColor: `${TYPE_COLORS[type]}`,
                                            color: 'white',
                                            fontSize: '11pt'
                                        }}
                                    >
                                        {type
                                        .toLowerCase()
                                        .split(' ')
                                        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                                        .join(' ')}
                                    </span>
                                ))}
                                 <h5 style={{color: 'white', float: 'right'}}>#{this.state.frontIndex}</h5>
                            </div>
                        </div>
                        <div className="bgInfPoke mx-auto"></div>
                        <div className="col-md-12 df idx mt-60" >
                            <img style={{width: '15em', height: '15em'}} src={this.state.imageUrl}
                                className=" rounded mx-auto imgInfoPoke"
                            />
                        </div>
                    </div>
                </div>
                <div className="card mt-65 col-md-6 ml-25">
                    <div className="mt90">
                        <Tabs defaultActiveKey="profile" id="navTab" activeKey={'about'}>
                            <Tab eventKey="about" title="About" >
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="row">
                                                <div className="col-md-6 col-6">
                                                    <div className="float-left fontStats">Height:</div>
                                                </div>
                                                <div className="col-md-6 col-6">
                                                    <h6 className="float-left">{this.state.height} m</h6>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 col-6">
                                                    <div className="float-left fontStats">Weight:</div>
                                                </div>
                                                <div className="col-md-6 col-6">
                                                    <h6 className="float-left">{this.state.weight} kg</h6>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 col-6">
                                                    <div className="float-left fontStats">Abilities:</div>
                                                </div>
                                                <div className="col-md-6 col-6">
                                                    <h6 className="float-left">{this.state.abilities}</h6>
                                                </div>
                                            </div>
                                            <h4 className="float-left mt-3 mb-3 col-md-12 col-12 pd-0">Breeding</h4>
                                            <div className="row">
                                                <div className="col-md-6 col-6">
                                                    <div className="float-left fontStats">Gender Ratio:</div>
                                                </div>
                                                <div className="col-md-6 col-6">
                                                    <div className="row col-md-12 col-12">
                                                        <div className="fontGender">{this.state.genderRatioMale}%</div>
                                                        <div className="genderPos" style={{backgroundColor: '#6D7BE3'}}></div>
                                                        <div className="fontGender" style={{marginLeft: '3px'}}>{this.state.genderRatioFemale}%</div>
                                                        <div className="genderPos" style={{backgroundColor: '#9F449F'}}></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 col-6">
                                                    <div className="float-left fontStats">Egg Group:</div>
                                                </div>
                                                <div className="col-md-6 col-6">
                                                    <h6 className="float-left">{this.state.eggGroups}</h6>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 col-6">
                                                    <div className="float-left fontStats">Egg Cycle:</div>
                                                </div>
                                                <div className="col-md-6 col-6">
                                                    <h6 className="float-left">{this.state.types[0]}</h6>
                                                </div>
                                            </div>
                                            <h4 className="float-left mt-3 mb-3 col-md-12 col-12 pd-0">Trainig</h4>
                                            <div className="row">
                                                <div className="col-md-6 col-6">
                                                    <div className="float-left fontStats">Capture Rate:</div>
                                                </div>
                                                <div className="col-md-6 col-6">
                                                    <h6 className="float-left">{this.state.catchRate} %</h6>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 col-6">
                                                    <div className="float-left fontStats">Effort Points:</div>
                                                </div>
                                                <div className="col-md-6 col-6">
                                                    <h6 className="float-left">{this.state.evs}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="status" title="Status">
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col-md-9">
                                            <div className="row align-items-center">
                                                <div className="col-md-3 col-4 fontStats">HP:</div>
                                                <div className="col-md-1 col-2">
                                                    {this.state.stats.hp}
                                                </div>
                                                <div className="col-md-8 col-6">
                                                    <div className="progress">
                                                        <div 
                                                            className="progress-bar" 
                                                            role="pregressBar" 
                                                            style={{width:`${this.state.stats.hp}%`}} 
                                                            aria-valuenow="25"
                                                            aria-valuemin="0"
                                                            aria-valuemax="100"
                                                        >
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row align-items-center">
                                                <div className="col-md-3 col-4 fontStats">Attack:</div>
                                                <div className="col-md-1 col-2">
                                                    {this.state.stats.attack}
                                                </div>
                                                <div className="col-md-8 col-6">
                                                    <div className="progress">
                                                        <div 
                                                            className="progress-bar" 
                                                            role="pregressBar" 
                                                            style={{width:`${this.state.stats.attack}%`}} 
                                                            aria-valuenow="25"
                                                            aria-valuemin="0"
                                                            aria-valuemax="100"
                                                        >
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row align-items-center">
                                                <div className="col-md-3 col-4 fontStats">Defense:</div>
                                                <div className="col-md-1 col-2">
                                                    {this.state.stats.defense}
                                                </div>
                                                <div className="col-md-8 col-6">
                                                    <div className="progress">
                                                        <div 
                                                            className="progress-bar" 
                                                            role="pregressBar" 
                                                            style={{width:`${this.state.stats.defense}%`}} 
                                                            aria-valuenow="25"
                                                            aria-valuemin="0"
                                                            aria-valuemax="100"
                                                        >
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row align-items-center">
                                                <div className="col-md-3 col-4 fontStats">Speed:</div>
                                                <div className="col-md-1 col-2">
                                                    {this.state.stats.speed}
                                                </div>
                                                <div className="col-md-8 col-6">
                                                    <div className="progress">
                                                        <div 
                                                            className="progress-bar" 
                                                            role="pregressBar" 
                                                            style={{width:`${this.state.stats.speed}%`}} 
                                                            aria-valuenow="25"
                                                            aria-valuemin="0"
                                                            aria-valuemax="100"
                                                        >
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row align-items-center">
                                                <div className="col-md-3 col-4 fontStats">Special Attack:</div>
                                                <div className="col-md-1 col-2">
                                                    {this.state.stats.specialAttack}
                                                </div>
                                                <div className="col-md-8 col-6">
                                                    <div className="progress">
                                                        <div 
                                                            className="progress-bar" 
                                                            role="pregressBar" 
                                                            style={{width:`${this.state.stats.specialAttack}%`}} 
                                                            aria-valuenow="25"
                                                            aria-valuemin="0"
                                                            aria-valuemax="100"
                                                        >
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row align-items-center">
                                                <div className="col-md-3 col-4 fontStats">Special Defense:</div>
                                                <div className="col-md-1 col-2">
                                                    {this.state.stats.specialDefense}
                                                </div>
                                                <div className="col-md-8 col-6">
                                                    <div className="progress">
                                                        <div 
                                                            className="progress-bar" 
                                                            role="pregressBar" 
                                                            style={{width:`${this.state.stats.specialDefense}%`}} 
                                                            aria-valuenow="25"
                                                            aria-valuemin="0"
                                                            aria-valuemax="100"
                                                        >
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mt-1">
                                        </div>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="evolution" title="Evolution">
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        )
    }
}
