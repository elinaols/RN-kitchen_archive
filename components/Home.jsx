import React, {useState} from "react"
import {StyleSheet, Text, View, FlatList, Pressable, ImageBackground} from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context'
import FetchData from "../features/FetchData"
import {spacing, fontSizes} from "../utils/sizes"
import {colors} from "../utils/colors"
import {IconButton, Icon} from "react-native-paper"

export default function Home({navigation}) {
	const [recepies, setRecepies] = useState([])

	const Recepie = ({recepies}) => (
		<View style={styles.recepieCard}>
			{/* 
				Pressable is used for the entire background to allow navigation to the desired recepie when the image is clicked 
			*/}
			<Pressable
				onPress={() => {
					navigation.navigate("How to cook?", {id: recepies._id})
				}}>
				<ImageBackground
					style={styles.backgroundImage}
					imageStyle={{borderRadius: 5}}
					source={{uri: recepies.image}}>
					<IconButton icon="arrow-right-circle" size={26} iconColor={colors.white} style={{margin: 0}} />
				</ImageBackground>
			</Pressable>
			<Text style={{fontSize: fontSizes.body, fontWeight: "bold", paddingTop: spacing.xs}}>{recepies.name}</Text>
			<View
				style={{flexDirection: "row", alignItems: "center", paddingTop: spacing.xs, paddingBottom: spacing.sm}}>
				<Icon source="timer-outline" size={24} />
				<Text style={{paddingLeft: spacing.xs}}>{recepies.preparationTime} min</Text>
			</View>
		</View>
	)

	return (
		<SafeAreaView style={styles.container} edges={['left', 'right']}>
			<View style={styles.navContainer}>
				<Text style={{fontSize: fontSizes.heading, paddingTop: spacing.md}}>Alla recept</Text>
			</View>
			<View style={styles.recepiesContainer}>
				{/* 
					Fetches the recepies from the external API and updates the state with the received data using the setRecepies function
				*/}
				<FetchData setRecepies={setRecepies} />
				{/* 
					Uses FlatList to display the fetched data. The function renderItem renders each item in the recepies array, keyExtractor ensures that 
					each item has a unique key based on the id and numColumns indicates how many columns the list should display 
				*/}
				<FlatList
					data={recepies}
					renderItem={({item}) => <Recepie recepies={item} />}
					keyExtractor={(item) => item._id}
					numColumns={2}
				/>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%",
		backgroundColor: colors.white,
		alignItems: "top",
	},
	navContainer: {
		width: "100%",
		alignItems: "flex-start",
		paddingLeft: spacing.sm,
	},
	recepiesContainer: {
		flex: 1,
		width: "100%",
		justifyContent: "center",
		paddingLeft: spacing.sm,
		alignItems: "center",
	},
	recepieCard: {
		paddingTop: spacing.sm,
		paddingBottom: spacing.md,
		width: "50%",
	},
	backgroundImage: {
		width: 180,
		height: 180,
		marginTop: spacing.sm,
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "flex-end",
	},
})
