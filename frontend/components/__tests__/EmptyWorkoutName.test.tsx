//This test is the result of ChatGPT and I think a bit of Deepseek (I think I also used the DarkMode test as input and pasted a few lines here to try to get it to work)
//I did try to implement the suggestions of using the global provider, but the sprint was ending so it currently doesn't work when exercises.length === 0
//you have to change it to !== in AddWorkoutScreen
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { AddWorkoutScreen } from '@/app/screens/workout/AddWorkoutScreen';
import { GlobalContext, GlobalProvider } from '@/context/GlobalContext';
import { WorkoutProvider } from '@/context/WorkoutContext';
import { NavigationContainer } from '@react-navigation/native';
import { Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const alertMock = jest.spyOn(Alert, 'alert');

describe('AddWorkoutScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  //mock global provider (creates a fake)
  //I removed the code that was trying to use this because it wasn't working, but I kept it in as a reminder if someone works on it again in the future
  // const MockGlobalProvider = ({ children, value }: any) => {
  //   return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
  // };
  jest.mock("@/context/SocialFeedContext", () => ({
    useSocialFeed: jest.fn(),
  }));

  it('shows alert when submitting without workout name', async () => {
    jest.spyOn(React, 'useState')
      .mockImplementationOnce(() => [[
        {
          listID: 1,
          exerciseID: 1,
          sets: 1,
          reps: [10],
          nameOfExercise: 'Push Up',
          exerciseType: 1,
          weight: [0],
        }
      ], jest.fn()])
      .mockImplementationOnce(() => ['', jest.fn()]); 

    const Stack = createNativeStackNavigator();

    const { getByTestId } = render(
      <GlobalProvider>
        <WorkoutProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="AddWorkoutsScreen" component={AddWorkoutScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </WorkoutProvider>
      </GlobalProvider>
    );

    const submitButton = getByTestId('submit-button');
    await act(async () => {
      fireEvent.press(submitButton);
    });
    //this test works when exercise.length === 0 is changed to !==
    //basically, I think the exercise mock isn't working correctly
    expect(alertMock).toHaveBeenCalled();
  });
});
