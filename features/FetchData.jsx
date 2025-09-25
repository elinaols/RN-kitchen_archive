import React, {useState, useEffect} from "react"
import {ActivityIndicator} from "react-native"
import {colors} from "../utils/colors"
import { API_URL } from "../config"; 

export default function FetchData({setRecepies, id}) {
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function getRecepies() {
			try {
				// Waits for the data to be fetched and then converts it to json format to ensure it's in the correct structure for UI rendering
				const response = await fetch(`${API_URL}`)
				const result = await response.json()
				// Checks if id is an array and not empty to create a new array based on matching ids
				if (Array.isArray(id) && id.length > 0) {
					const favoriteRecepies = result.filter((recepies) => id.includes(recepies._id))
					setRecepies(favoriteRecepies)
				} else if (id) {
					// Finds a specific recepie by matching the given id with the id in the storage to be able to display it on the details screen
					const specificRecepie = result.find((recipie) => recipie._id === id)
					setRecepies(specificRecepie)
				} else {
					// Sets all fetched recepies to the state variable if id isn't provided
					setRecepies(result)
				}
			} catch (error) {
				console.log("API", process.env.NEXT_PUBLIC_API_URL)
				console.error("Something went wrong", error.message)
			} finally {
				// Ends the loading state once data has been fetched
				setLoading(false)
			}
		}
		// Calls the function when the component is mounted
		getRecepies()
	}, [id])

	return <>{loading ? <ActivityIndicator size="large" color={colors.green} /> : null}</>
}
