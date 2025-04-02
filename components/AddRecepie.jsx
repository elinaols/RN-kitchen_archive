import React, {useState} from "react"
import {StyleSheet, Text, View, Pressable, TextInput, ScrollView} from "react-native"
import {spacing, fontSizes} from "../utils/sizes"
import {colors} from "../utils/colors"
import {IconButton} from "react-native-paper"

export default function AddRecepie({navigation}) {
	const [preparationTime, setPreparationTime] = useState("")
	const [name, setName] = useState("")
	const [ingredients, setIngredients] = useState([])
	const [instructions, setInstructions] = useState([])
	// The next step is to implement image uploading functionality
	const image = "https://webbkurs.ei.hv.se/~elol0031/images/preparing.webp"
	const [ingredientInput, setIngredientInput] = useState([])
	const [instructionInput, setInstructionInput] = useState([])

	// Displays the inputs of the ingredients and instructions so the user can see what they will save in the new recepie.
	const ShowData = ({data, array}) => (
		<>
			<ScrollView>
				{Array.isArray(data) &&
					data.map((item, index) => (
						<View
							key={index}
							style={{paddingBottom: spacing.sm, flexDirection: "row", alignItems: "center"}}>
							<IconButton
								icon={"minus-circle"}
								size={24}
								iconColor={colors.green}
								style={{margin: 0}}
								onPress={() => removeInput(index, array)}
							/>
							<Text style={{flexShrink: 1}}>{item}</Text>
						</View>
					))}
			</ScrollView>
		</>
	)

	// Removes a specific input that the user has already entered. The filter()-function iterates through the array and removes the item if its index doesn't match the given id
	const removeInput = (index, array) => {
		if (array === "ingredients") {
			setIngredients(ingredients.filter((ingredient, id) => id !== index))
		}
		if (array === "instructions") {
			setInstructions(instructions.filter((instruction, id) => id !== index))
		}
	}

	// Asyncronous function that makes a request to the database to permanently save a recepie
	const saveRecepie = async () => {
		try {
			const response = await fetch(`https://api-kitchen-archive.onrender.com/recepies`, {
				method: "POST",
				headers: {
					// Tells the server that we expect a json response
					Accept: "application/json",
					// Tells the server that the request body is in json format
					"Content-Type": "application/json",
				},
				// Converts JavaScript object into json string
				body: JSON.stringify({
					preparationTime: preparationTime,
					instructions: instructions,
					ingredients: ingredients,
					name: name,
					image: image,
				}),
			})

			// Displays an error message if the HTTP request fails
			if (!response.ok) throw new Error(`Something went wrong with the HTTP request: ${response.status}`)

			// Receives a response from the database indicating what has been created
			const data = await response.json()
			console.log("A new recepie has been added: ", data)

			// Resets the states to be able to type in new values for the new upcoming recepie
			setPreparationTime("")
			setIngredients("")
			setInstructions("")
			setName("")

            return navigation.navigate("Home")
		} catch (error) {
			console.error("Something went wrong with the POST method", error)
		}
	}

	return (
		<ScrollView style={styles.container}>
			<View>
				<Text style={{fontSize: fontSizes.subtitle, paddingTop: spacing.md, paddingBottom: spacing.lg}}>
					Skapa nytt recept
				</Text>
			</View>
			<View style={{marginBottom: spacing.md}}>
				<Text style={{fontSize: fontSizes.body, paddingBottom: spacing.sm}}>
					Ange förberedelsetid i minuter:
				</Text>
				<TextInput
					style={styles.input}
					value={preparationTime}
					onChangeText={setPreparationTime}
					keyboardType="numeric"
					placeholder="Ange en förberedelsetid"
				/>
			</View>
			<View style={{marginBottom: spacing.md}}>
				<Text style={{fontSize: fontSizes.body, paddingBottom: spacing.sm}}>Ange receptnamn:</Text>
				<TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ange ett receptnamn" />
			</View>
			<View style={{marginBottom: spacing.sm}}>
				<Text style={{fontSize: fontSizes.body}}>Ange en ingrediens i taget:</Text>
				<View style={{flexDirection: "row", alignItems: "center"}}>
					<TextInput
						style={styles.input}
						value={ingredientInput}
						onChangeText={setIngredientInput}
						placeholder="Ange en ingrediens"
					/>
					<IconButton
						icon="plus-circle-outline"
						iconColor={colors.green}
						size={36}
						// Adds the new input to the ingredients array and clears the input field to be able to type in a new ingredient
						onPress={() => {
							setIngredients((prev) => [...prev, ingredientInput])
							setIngredientInput("")
						}}
						style={{paddingRight: spacing.md}}
					/>
				</View>
				<ShowData data={ingredients} array="ingredients" />
			</View>
			<View style={{paddingBottom: spacing.md}}>
				<Text style={{fontSize: fontSizes.body}}>Ange en instruktion i taget:</Text>
				<View style={{flexDirection: "row", alignItems: "center"}}>
					<TextInput
						style={styles.input}
						value={instructionInput}
						onChangeText={setInstructionInput}
						placeholder="Ange en instruktion"
					/>
					<IconButton
						icon="plus-circle-outline"
						iconColor={colors.green}
						size={36}
						// Adds the new input to the instructions array and clears the input field to be able to type in a new instruction
						onPress={() => {
							setInstructions((prev) => [...prev, instructionInput])
							setInstructionInput("")
						}}
						style={{paddingRight: spacing.md}}
					/>
				</View>
				<ShowData data={instructions} array="instructions" />
			</View>
			<Pressable onPress={() => saveRecepie()} style={[styles.button, {alignSelf: "flex-end"}]}>
				<Text style={{color: colors.lightgreen}}>Spara recept</Text>
			</Pressable>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%",
		backgroundColor: colors.white,
		paddingHorizontal: spacing.sm,
	},
	input: {
		width: "90%",
		borderRadius: 5,
		height: 40,
		padding: spacing.sm,
		borderWidth: 1,
		borderColor: colors.green,
	},
	button: {
		backgroundColor: colors.green,
		alignItems: "center",
		padding: 8,
		borderRadius: 5,
		alignSelf: "flex-end",
	},
})
