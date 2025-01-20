import React, { useState, useEffect } from 'react';
import { SafeAreaView, TouchableOpacity, Text, View, StyleSheet } from 'react-native';

function Pomodoro() {
  const [time, setTime] = useState(25 * 60); // Default to 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (time === 0) {
      setTime(25 * 60); // Reset to 25 minutes after it reaches 0
    }
  }, [time]);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      const id = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
      setIntervalId(id);
    }
  };

  const pauseTimer = () => {
    if (isRunning) {
      clearInterval(intervalId);
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    clearInterval(intervalId);
    setIsRunning(false);
    setTime(25 * 60); // Reset to 25 minutes
  };

  const setFocusTime = (minutes) => {
    clearInterval(intervalId);
    setIsRunning(false);
    setTime(minutes * 60); // Set new time in seconds
  };

  const formatTime = (timeInSeconds) => {
    const min = Math.floor(timeInSeconds / 60);
    const sec = timeInSeconds % 60;
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.timer}>{formatTime(time)}</Text>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={startTimer} disabled={isRunning}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pauseTimer} disabled={!isRunning}>
          <Text style={styles.buttonText}>Pause</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={resetTimer}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.focusTimeRow}>
        <TouchableOpacity style={styles.focusTimeButton} onPress={() => setFocusTime(25)}>
          <Text style={styles.focusText}>25 min</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.focusTimeButton} onPress={() => setFocusTime(30)}>
          <Text style={styles.focusText}>30 min</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.focusTimeButton} onPress={() => setFocusTime(45)}>
          <Text style={styles.focusText}>45 min</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    padding: 20,
  },
  timer: {
    fontSize: 40,
    color: '#B9BF92',
    fontWeight: 'bold',
    margin: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  button: {
    backgroundColor: '#F5D9DE',
    padding: 10,
    margin: 4,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  focusTimeRow: {
    flexDirection: 'row',
    marginTop: 10,
    width: '90%',
  },
  focusTimeButton: {
    borderColor: '#991044',
    borderWidth: 1,
    padding: 5,
    margin: 5,
    borderRadius: 30,
    flex: 1,
    alignItems: 'center',
  },
  focusText: {
    color: '#991044',
  },
});

export default Pomodoro;
