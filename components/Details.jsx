import React, {useEffect, useState} from "react"
import {
	StyleSheet,
	Text,
	View,
	ActivityIndicator,
	SafeAreaView,
	ImageBackground,
	ScrollView,
	TextInput,
	Pressable,
} from "react-native"
import FetchData from "../features/FetchData"
import {spacing, fontSizes} from "../utils/sizes"
import {IconButton} from "react-native-paper"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {colors} from "../utils/colors"

export default function Details({route, navigation}) {
	const [recepies, setRecepies] = useState([])
	const [iconColor, setIconColor] = useState()
	const [pressed, setPressed] = useState(false)
	const [editMode, setEditMode] = useState(false)
	const [preparationTime, setPreparationTime] = useState("")
	const [name, setName] = useState("")
	const [ingredients, setIngredients] = useState([])
	const [instructions, setInstructions] = useState([])
	const image = recepies.image ? recepies.image : "https://webbkurs.ei.hv.se/~elol0031/images/preparing.webp"

	// Recevies the id to be able to fetch and display the specific recepie
	const {id} = route.params

	/* 	
		Toggles a specific icon button to be able to track its status independently
		Code from https://typeofnan.dev/how-to-toggle-an-array-of-items-seaparately-in-react/ 
	*/
	const checkToggle = (index) => {
		// Updates the pressed state by toggling the buttons current status
		setPressed((prev) => ({
			// Keeps all previous values to prevent overwriting other buttons
			...prev,
			// Toggles the pressed state of the button to update its status
			[index]: !prev[index],
		}))
	}

	// Asyncronous function that makes a request to the database to permanently delete a recepie with a specified id
	const deleteRecepie = async () => {
		try {
			const response = await fetch(`https://api-kitchen-archive.onrender.com/recepies/${id}`, {
				method: "DELETE",
				headers: {
					// Tells the server that we expect a json response
					Accept: "application/json",
				},
			})

			// Displays an error message if the HTTP request fails
			if (!response.ok) throw new Error(`Something went wrong with the HTTP request: ${response.status}`)

			// Receives a response from the database indicating what has been deleted
			const data = await response.json()
			console.log("A new recepie has been deleted: ", data)

			return navigation.navigate("Home")
		} catch (error) {
			console.error("Something went wrong with the DELETE method", error)
		}
	}

	// Sets initial values for useState to display the correct data from the database
	useEffect(() => {
		setName(recepies.name)
		setPreparationTime(recepies.preparationTime)
		setIngredients(recepies.ingredients)
		setInstructions(recepies.instructions)
		// Updates whenever the recepies variable is updated
	}, [recepies])

	// Makes a request to the database to permanently update a recepie with a specified id
	const saveInputToDb = async () => {
		console.log("The updated variables: ", preparationTime, image, instructions, ingredients, name)
		// Sets the state to true to enable calling the updateRecepie function
		try {
			const response = await fetch(`https://api-kitchen-archive.onrender.com/recepies/${id}`, {
				method: "PUT",
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

			// Receives a response from the database indicating what has been deleted
			const data = await response.json()
			console.log("A new recepie has been updated: ", data)

			// Sets the state to false to disable edit mode
			setEditMode(false)

			return navigation.navigate("Home")
		} catch (error) {
			console.error("Something went wrong with the PUT method", error)
		}
	}

	// Stores a new id into AsyncStorage or if it's already in the storage it will be removed
	// Code from https://react-native-async-storage.github.io/async-storage/docs/usage
	const storeId = async (newId) => {
		try {
			// Retrieves all ids from storage to be able to add the new id to the storage
			const currentIds = await AsyncStorage.getItem("id")
			// Retrieve the stored ids from AsyncStorage, otherwise an empty array will be initialized
			let array = currentIds ? JSON.parse(currentIds) : []
			// Checks if the array already contains the new id and removes it if it does
			if (array.includes(newId)) {
				// Creating a new array without the new id
				array = array.filter((id) => id !== newId)
				// Stores the modified array (and also stringlifies it) to storage and updates the icon color to indicate that the recepie has been removed from favorites
				await AsyncStorage.setItem("id", JSON.stringify(array))
				setHeartColor()
				return
			}
			// Adds the new id to the array
			array.push(newId)
			// Stores the new updated array to storage and updates the icon color to indicate that the recepie has been added to favorites
			await AsyncStorage.setItem("id", JSON.stringify(array))
			setHeartColor()
		} catch (error) {
			console.error("Failed to save ID to storage", error)
		}
	}

	// Get the ids from AsyncStorage to set the color of the icon
	const setHeartColor = async () => {
		try {
			const currentIds = await AsyncStorage.getItem("id")
			// Retrieve the stored ids from AsyncStorage, otherwise an empty array will be initialized
			const array = currentIds ? JSON.parse(currentIds) : []
			// If the array in AsyncStorage includes id it will set the color to red else it will be set to white
			setIconColor(array.includes(id) ? "red" : "white")
		} catch (error) {
			console.error("Failed to set the color for the icon", error)
		}
	}

	// When this component mounts for the first time it will call the function to set the colors on the heart-icon
	useEffect(() => {
		setHeartColor()
	}, [])

	return (
		<SafeAreaView style={styles.container}>
			<ImageBackground source={{uri: recepies.image}} style={styles.backgroundWrapper} resizeMode="cover">
				<IconButton
					icon="heart"
					iconColor={iconColor}
					size={35}
					title="Add favorite recepie"
					onPress={() => {
						storeId(id)
					}}
				/>
			</ImageBackground>
			<View style={styles.recepiesContainer}>
				{/* 
					Fetches data for the specific recepie using the id that is passed from the previous screen and updates the recepies state with the 
					received data through the setRecepies function
				*/}
				<FetchData setRecepies={setRecepies} id={id} />
				{/* 
					If the specific recepie is retrieved it will be displayed on the screen, otherwise the ActivityIndicator will be shown
				*/}
				{recepies ? (
					<>
						<View style={{flexDirection: "row", alignItems: "top", justifyContent: "space-between"}}>
							<View style={{paddingHorizontal: spacing.md, flexShrink: 1}}>
								<Text style={{fontSize: fontSizes.subtitle}}>{name}</Text>
								<TextInput
									value={name}
									onChangeText={(e) => setName(e)}
									placeholder="Ange receptnamn"
									editable={editMode}
									style={{
										borderWidth: 1,
										padding: 8,
										borderRadius: 5,
										display: editMode ? "flex" : "none",
									}}
								/>
								<Text style={{fontSize: fontSizes.body}}>{`${preparationTime} min`}</Text>
								<TextInput
									value={preparationTime}
									onChangeText={(e) => setPreparationTime(e)}
									placeholder="Ange tid"
									editable={editMode}
									style={{
										borderWidth: 1,
										padding: 8,
										borderRadius: 5,
										display: editMode ? "flex" : "none",
									}}
								/>
							</View>
							<View style={{flexDirection: "row"}}>
								<IconButton
									icon={"pencil"}
									size={32}
									iconColor={colors.green}
									style={{margin: 0}}
									// Toggles the value between true and false based on its previous state
									onPress={() => setEditMode((prev) => !prev)}
								/>
								<IconButton
									icon={"delete-forever"}
									size={32}
									iconColor={colors.green}
									style={{margin: 0}}
									onPress={() => deleteRecepie()}
								/>
							</View>
						</View>
						{/*
					Wraps the ingredients and instructions to a scroll view to allow the user to scroll through all the retrieved data
				*/}
						<ScrollView style={{paddingBottom: spacing.lg, paddingTop: spacing.md}}>
							<View>
								{recepies.ingredients &&
									recepies.ingredients.map((ingredient, index) => (
										<View
											key={index}
											style={{
												flex: 1,
												flexDirection: "row",
												alignItems: "center",
												paddingBottom: spacing.xs,
												paddingHorizontal: spacing.md,
											}}>
											<IconButton
												// Checks whether the icon is pressed to toggle between the to icons
												icon={
													pressed[index]
														? "checkbox-marked-circle"
														: "checkbox-blank-circle-outline"
												}
												size={24}
												iconColor={colors.green}
												style={{margin: 0}}
												onPress={() => checkToggle(index)}
											/>
											<View>
												<Text>{ingredient}</Text>
												<TextInput
													value={ingredients}
													onChangeText={(e) => {
														// Saves all the current ingredients to a temporary array
														const updatedArray = [...ingredients]
														// Updates the specified ingredients with the new user input
														updatedArray[index] = e
														// Updates the array with the new input and keeps the other values as it was before
														setIngredients(updatedArray)
													}}
													placeholder="Ange ny ingrediens"
													editable={editMode}
													style={{
														borderWidth: 1,
														padding: 8,
														borderRadius: 5,
														display: editMode ? "flex" : "none",
													}}
												/>
											</View>
										</View>
									))}
							</View>
							<View style={{paddingTop: spacing.lg}}>
								{recepies.ingredients &&
									recepies.instructions.map((instruction, index) => (
										<View
											key={index}
											style={{flex: 1, flexDirection: "row", paddingHorizontal: spacing.md}}>
											<View style={{paddingBottom: spacing.md}}>
												<Text>{`${index + 1}. ${instruction}`}</Text>
												<TextInput
													value={instructions}
													onChangeText={(e) => {
														// Saves all the current ingredients to a temporary array
														const updatedArray = [...instructions]
														// Updates the specified ingredients with the new user input
														updatedArray[index] = e
														// Updates the array with the new input and keeps the other values as it was before
														setInstructions(updatedArray)
													}}
													placeholder="Ange ny instruktion"
													editable={editMode}
													style={{
														borderWidth: 1,
														padding: 8,
														borderRadius: 5,
														display: editMode ? "flex" : "none",
													}}
												/>
											</View>
										</View>
									))}
							</View>
							<View style={{paddingRight: spacing.md, paddingTop: spacing.md}}>
								<Pressable
									onPress={editMode ? saveInputToDb : null}
									style={[styles.button, {alignSelf: "flex-end", marginBottom: spacing.md}]}>
									<Text style={{color: colors.lightgreen}}>Spara recept</Text>
								</Pressable>
							</View>
						</ScrollView>
					</>
				) : (
					<ActivityIndicator size="large" color={colors.green} />
				)}
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%",
	},
	backgroundWrapper: {
		flex: 0.3,
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	recepiesContainer: {
		flex: 0.7,
		paddingTop: spacing.lg,
		borderTopLeftRadius: 40,
		borderTopRightRadius: 40,
		backgroundColor: "#fff",
		marginTop: -38,
	},
	button: {
		backgroundColor: colors.green,
		alignItems: "center",
		padding: 9,
		borderRadius: 5,
		alignSelf: "flex-end",
	},
})
