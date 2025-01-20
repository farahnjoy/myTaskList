import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TodoScreen from './TodoScreen';
import Pomodoro from './Pomodoro';

const Drawer = createDrawerNavigator();
function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Tasks">
        <Drawer.Screen name="Tasks" component={TodoScreen} />
        <Drawer.Screen name="Pomodoro" component={Pomodoro} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
export default App;
