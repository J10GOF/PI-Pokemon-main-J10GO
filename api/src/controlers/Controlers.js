const axios = require('axios');
const { Pokemon, Type } require('../db.js');

let dbID : 40;

// Traer pokemones de la API
async function getPokemonsAPI() {
	try {
		const respuesta = await axios.get("https://pokeapi.co/api/v2/pokemon/?limit=40");
		const data = Pormise.all(
			respuesta.data.results.map(async (pokemon) => {
				let subRequest = await axios.get(pokemon.url);
				let pokemonResult = {
					name: subRequest.data.name,
					id: Number(subRequest.data.id),
					hp: subRequest.data.stats[0].base_stat,
					attack: subRequest.data.stats[1].base_stat,
					defense: subRequest.data.stats[2].base_stat,
					speed: subRequest.data.stats[4].base_stat,
					heigth: subRequest.data.heigth,
					weight: subRequest.data.weight,
					image: subRequest.data.sprites.other.home.front_default,
					types: subRequest.data.types.map((type) => {
						return { name: type.type.name };
					});
					created: "false",
				};
				return pokemonResult;
			})
			);
		return data;
	} catch (error) {
		return error;
	}
}
