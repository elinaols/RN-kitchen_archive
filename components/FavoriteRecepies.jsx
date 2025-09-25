import React, {useEffect, useState} from "react"
import {StyleSheet, Text, View, FlatList, Pressable, Image} from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context'
import FetchData from "../features/FetchData"
import {spacing} from "../utils/sizes"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {colors} from "../utils/colors"
import {fontSizes} from "../utils/sizes"
import {Icon} from "react-native-paper"

export default function FavoriteRecepies({navigation}) {
	const [recepies, setRecepies] = useState([])
	const [id, setId] = useState([])

	/*
		Fetches the stored favorite recepies when the component mounts 
		Code from https://react-native-async-storage.github.io/async-storage/docs/usage
	*/
	useEffect(() => {
		const getRecepies = async () => {
			try {
				// Retrieves the stored ids from AsyncStorage to be able to display them on the screen
				const currentIds = await AsyncStorage.getItem("id")
				// If any ids are found in storage, they will be assigned to the id state variable
				return currentIds != null ? setId(JSON.parse(currentIds)) : null
			} catch (error) {
				console.log("Couldn't get the recepies from storage", error)
			}
		}
		// Calls the function to retrieve all recepies from the AsyncStorage
		getRecepies()
	}, [])

	const Recepie = ({recepies}) => (
		<>
			{recepies && (
				<View style={styles.favoriteRecepies}>
					{/* 
						Pressable is used for the entire image to allow navigation to the desired recepie when the image is clicked 
					*/}
					<Pressable
						onPress={() => {
							navigation.navigate("How to cook?", {id: recepies._id})
						}}>
						<Image style={styles.image} source={{uri: recepies.image}} />
					</Pressable>
					<View style={{paddingVertical: spacing.md, flexShrink: 1}}>
						<Text style={{fontSize: fontSizes.subtitle, flexWrap: "wrap"}}>{recepies.name}</Text>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								paddingTop: spacing.xs,
								paddingBottom: spacing.sm,
							}}>
							<Icon source="timer-outline" size={24} />
							<Text style={{paddingLeft: spacing.xs}}>{recepies.preparationTime} min</Text>
						</View>
						<Pressable
							onPress={() => {
								navigation.navigate("How to cook?", {id: recepies._id})
							}}
							style={[styles.button, {alignSelf: "flex-start"}]}>
							<Text style={{color: colors.lightgreen}}>Visa recept</Text>
						</Pressable>
					</View>
				</View>
			)}
		</>
	)

	return (
		<SafeAreaView style={styles.container} edges={['left', 'right']}>
			<View style={styles.recepiesWrapper}>
				{/* 
					If the length of the id array is greater than 0, the favorite recepies will be fetched from the external API and the state will be updated with the 
					received data using the setRecepies function
				*/}
				{id.length > 0 && <FetchData setRecepies={setRecepies} id={id} />}
				{/* 
					Displays the favorite recepies using FlatList. If no recepies are found will a message be shown. 
					The function renderItem renders each recepie, keyExtractor ensures that each recepie has a unique key and numColumns sets the number of columns
				*/}
				{recepies && recepies.length > 0 ? (
					<FlatList
						data={recepies}
						renderItem={({item}) => <Recepie recepies={item} />}
						keyExtractor={(item) => item._id}
					/>
				) : (
					<Text style={{textAlign: "center", paddingTop: spacing.xs, fontSize: fontSizes.body}}>
						You haven't saved any recepies here
					</Text>
				)}
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%",
		backgroundColor: colors.white,
		alignItems: "center",
	},
	image: {
		width: 200,
		height: 180,
		borderRadius: 5,
		marginTop: spacing.sm,
		marginBottom: spacing.sm,
	},
	recepiesWrapper: {
		flex: 1,
		width: "100%",
		paddingHorizontal: spacing.sm,
		paddingTop: spacing.xs,
	},
	favoriteRecepies: {
		flexDirection: "row",
		paddingVertical: spacing.sm,
		width: "100%",
		gap: spacing.md,
	},
	button: {
		backgroundColor: colors.green,
		alignItems: "center",
		padding: 8,
		borderRadius: 5,
	},
})
