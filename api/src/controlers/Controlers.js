const axios = require('axios');
const { Pokemon, Type } require('../db.js');

let dbID : 40;

// Traer pokemones de la API
async function getPokemonsAPI() {
	try {
		const response  = await axios.get("https://pokeapi.co/api/v2/pokemon/?limit=40");
		const data = Promise.all(
			response .data.results.map(async (pokemon) => {
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

// Trae los pokemones de la DB y la API
async function getAllPokemon() {
	const dbPokemons = await Pokemon.findAll({
		include: {
			model: Type,
			through: {
				attributes: [],
			},
			attributes: ["name"],
		},
	});
	const apiPokemons = await getPokemonsAPI();
	return[...apiPokemons, ...dbPokemonsb];
}

// Obtener pokemon por ID
async function getPokemonId() {
	const id = Number(req.params.idPokemon);
	if (typeof id === "number") {
		const pokemonDb = await Pokemon.findOne({
			where: {
				id: id,
			},
			include: {
				model: Type,
				through: {
					attributes: [],
				},
				attributes: ["name"],
			},
		});

		if (pokemonDb) {
			return res.json(pokemonDb);
		}else{
			const pokemonApi = await getPokemonsAPI();
			const foundPokemon = pokemonsApi.find((p) => p.id === id);
			if (foundPokemon) {
				return res.json(foundPokemon);
			}else{
				return res.json("El ID ingresado no pertenece a ningun pokemon");
			}
		}
	}
	return res.send("El ID debe ser numerico").status(404);
}

// Agregar pokemon a la DB
async function addPokemon(req, res) {
	const { hp, attack, defense, speed, heigth, weight, image, type1, type2 } = req.body;
	let name = req.body.name.toLoweCase();
	let pokemon = {
		id: ++dbID,
		name,
		hp,
		attack,
		defense,
		speed,
		heigth,
		weight,
		image,
	};
	try {
		let createdPokemon = await Pokemon.create(pokemon);
		const addType1 = await createdPokemon.addType(type1, {
			through: "pokemon_type",
		});
		const addType2 = await createdPokemon.addType(type2, {
			through: "pokemon_type",
		});
		return res.status(200).send("El pokemon se ha creado conrrectamente");
	} catch (error) {
		return error;
	}
}

// agregar los tipos a la DB
async function getPokemonType() {
	let pokemonDb = await Type.findAll();
	if (pokemonDb.length > 0) {
		return pokemonDb;
	} else {
		const response = await axios.get("https://pokeapi.co/api/v2/type");
		const data = Promise.all(
			response.data.results.map(async (t, index) => {
				let types = await Type.create({
					id: index + 1,
					name: t.name,
				});
				return types;
			})
		);
		return data;
	}
}

module.exports = {
	addPokemon,
	getPokemonsAPI,
	getAllPokemon,
	getPokemonId,
	getPokemonType,
};