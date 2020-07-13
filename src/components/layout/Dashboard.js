import React, {Component} from 'react';
import PokemonList from '../pokemon/PokemonList';

function Dashboard() {
    return (
     <div>
        <div className="col">
            <PokemonList/>
        </div>
     </div>
    );
}

export default Dashboard;