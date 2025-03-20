import React, {useEffect, useState} from "react"
import {StyleSheet, Text, View, ActivityIndicator, SafeAreaView, ImageBackground, ScrollView} from "react-native"
import FetchData from "../features/FetchData"
import {spacing, fontSizes} from "../utils/sizes"
import {IconButton} from "react-native-paper"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {colors} from "../utils/colors"

export default function Details({route}) {
	const [recepies, setRecepies] = useState([])
	const [iconColor, setIconColor] = useState()
	const [pressed, setPressed] = useState(false)

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

	const Recepie = ({recepies}) => (
		<>
			<Text style={{fontSize: fontSizes.subtitle, paddingHorizontal: spacing.md}}>{recepies.name}</Text>
			<Text style={{paddingHorizontal: spacing.md}}>{recepies.preparationTime + ' min'}</Text>
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
									icon={pressed[index] ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
									size={24}
									iconColor={colors.green}
									style={{margin: 0}}
									onPress={() => checkToggle(index)}
								/>
								<Text style={{paddingLeft: spacing.xs}}>{ingredient}</Text>
							</View>
						))}
				</View>
				<View style={{paddingTop: spacing.lg}}>
					{recepies.ingredients &&
						recepies.instructions.map((instruction, index) => (
							<View key={index} style={{flex: 1, flexDirection: "row", paddingHorizontal: spacing.md}}>
								<Text>{index + 1}. </Text>
								<Text style={{paddingBottom: spacing.xl, paddingLeft: spacing.xs, flexShrink: 1}}>
									{instruction}
								</Text>
							</View>
						))}
				</View>
			</ScrollView>
		</>
	)

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
				{recepies ? <Recepie recepies={recepies} /> : <ActivityIndicator size="large" color={colors.green} />}
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
})
