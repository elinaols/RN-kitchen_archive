import React from "react"
import {CommonActions, NavigationContainer} from "@react-navigation/native"
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import Home from "./components/Home"
import Details from "./components/Details"
import FavoriteRecepies from "./components/FavoriteRecepies"
import AddRecepie from "./components/AddRecepie"
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"
import {SafeAreaProvider} from "react-native-safe-area-context"
import {Icon} from "react-native-paper"
import {colors} from "./utils/colors"
import {fontSizes} from "./utils/sizes"

// Creates a new stack and tab navigator for handling navigation between different screens
const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

// Stack navigator for navigating between the home and details screens
const HomeStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
			<Stack.Screen name="How to cook?" component={Details} options={{headerShown: false}} />
		</Stack.Navigator>
	)
}
// Stack navigator for navigating between the favorites and details screens
const FavoriteStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Favorites" component={FavoriteRecepies} options={{headerShown: false}} />
			<Stack.Screen name="How to cook?" component={Details} options={{headerShown: false}} />
			<Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
		</Stack.Navigator>
	)
}
// Stack navigator for navigating between the favorites and details screens
const AddRecepieStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Add Recepie" component={AddRecepie} options={{headerShown: false}} />
			<Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
			<Stack.Screen name="How to cook?" component={Details} options={{headerShown: false}} />
		</Stack.Navigator>
	)
}
// Bottom tab navigator for navigating between the home and favorites stacks
const Tabs = () => {
	return (
		<Tab.Navigator
			screenOptions={{
				tabBarActiveTintColor: colors.green,
				headerStyle: {
					backgroundColor: colors.lightgreen,
				},
				headerTitleStyle: {
					fontSize: fontSizes.headerTitle,
					fontWeight: "bold",
					color: colors.green,
				},
				headerTitleAlign: "center",
			}}>
			<Tab.Screen
				name="Kitchen Archive"
				component={HomeStack}
				options={{
					tabBarLabel: "Hem",
					tabBarLabelStyle: {
						fontWeight: "bold",
						fontSize: fontSizes.tabFontSize,
					},
					tabBarActiveBackgroundColor: colors.lightgrey,
					tabBarIcon: () => <Icon source="home" size={25} color={colors.green} />,
				}}
				// Listens for tab press to reset the navigation history and return to the home screen
				listeners={({navigation}) => ({
					tabPress: (e) => {
						// Prevents the default action to manually handle navigation to the home screen
						e.preventDefault()
						// Handles the navigation action to reset the stack navigation history
						navigation.dispatch(
							// Resets the navigation stack to set Kitchen Archive as the new standard route
							CommonActions.reset({
								routes: [{name: "Kitchen Archive"}],
							})
						)
					},
				})}
			/>
			<Tab.Screen
				name="Sparade recept"
				component={FavoriteStack}
				options={{
					tabBarLabel: "Mina favoriter",
					tabBarLabelStyle: {
						fontWeight: "bold",
						fontSize: fontSizes.tabFontSize,
					},
					tabBarActiveBackgroundColor: colors.lightgrey,
					tabBarIcon: () => <Icon source="heart" size={25} color={colors.green} />,
				}}
				// Listens for tab press to reset the navigation history and return to the home screen
				listeners={({navigation}) => ({
					tabPress: (e) => {
						// Prevents the default action to manually handle navigation to the home screen
						e.preventDefault()
						// Handles the navigation action to reset the stack navigation history
						navigation.dispatch(
							// Resets the navigation stack to set Kitchen Archive as the new standard route
							CommonActions.reset({
								routes: [{name: "Sparade recept"}],
							})
						)
					},
				})}
			/>
			<Tab.Screen
				name="Nytt recept"
				component={AddRecepieStack}
				options={{
					tabBarLabel: "Nytt recept",
					tabBarLabelStyle: {
						fontWeight: "bold",
						fontSize: fontSizes.tabFontSize,
					},
					tabBarActiveBackgroundColor: colors.lightgrey,
					tabBarIcon: () => <Icon source="plus-thick" size={25} color={colors.green} />,
				}}
				// Listens for tab press to reset the navigation history and return to the home screen
				listeners={({navigation}) => ({
					tabPress: (e) => {
						// Prevents the default action to manually handle navigation to the home screen
						e.preventDefault()
						// Handles the navigation action to reset the stack navigation history
						navigation.dispatch(
							// Resets the navigation stack to set Kitchen Archive as the new standard route
							CommonActions.reset({
								routes: [{name: "Nytt recept"}],
							})
						)
					},
				})}
			/>
		</Tab.Navigator>
	)
}

export default function App() {
	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<Tabs />
			</NavigationContainer>
		</SafeAreaProvider>
	)
}
