import React, { useState } from 'react';
import {
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { Card } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import ConfettiCannon from 'react-native-confetti-cannon';

function TodoScreen() {
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isConfettiVisible, setIsConfettiVisible] = useState(false);

  const addTask = () => {
    if (task.trim() !== '' && dueDate) {
      const formattedDate = dueDate.toISOString();
      setTasks([{ id: Date.now().toString(), text: task, dueDate: formattedDate }, ...tasks]);
      setTask('');
      setDueDate(new Date());
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((item) => item.id !== id));
    setCompletedTasks(completedTasks.filter((item) => item !== id));
  };

  const clearAllTasks = () => {
    setTasks([]);
    setCompletedTasks([]);
  };

  const toggleCompleteTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    const updatedCompletedTasks = updatedTasks
      .filter((task) => task.completed)
      .map((task) => task.id);
    setCompletedTasks(updatedCompletedTasks);

    setTimeout(() => {
      const sortedTasks = updatedTasks.sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      });
      setTasks([...sortedTasks]);
    }, 500);
  };

  const calculateCompletionPercentage = () => {
    if (tasks.length === 0) return 0;
    const percentage = Math.round((completedTasks.length / tasks.length) * 100);
    if (percentage === 100 && !isConfettiVisible) {
      setIsConfettiVisible(true);
      setTimeout(() => setIsConfettiVisible(false), 3000);
    }
    return percentage;
  };

  const isOverdue = (dueDate) => {
    const taskDate = new Date(dueDate);
    const today = new Date();
    return taskDate < today.setHours(0, 0, 0, 0);
  };

  const isDueTomorrowOrToday = (dueDate) => {
    const taskDate = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    // Check if the task date is either today or tomorrow
    return (
      taskDate.toDateString() === today.toDateString() ||
      taskDate.toDateString() === tomorrow.toDateString()
    );
  };

  const renderTask = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.taskContainer}>
        <TouchableOpacity onPress={() => toggleCompleteTask(item.id)}>
          <Text style={styles.checkbox}>{item.completed ? '✔️' : '⬜'}</Text>
        </TouchableOpacity>
        <View style={styles.taskDetails}>
          <Text style={[styles.taskText, item.completed && styles.completedTask]}>
            {item.text}
          </Text>
          <Text style={styles.dueDateText}> Due: {new Date(item.dueDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
         {!item.completed && (
          <View style={styles.indicatorContainer}>
            {isOverdue(item.dueDate) && <View style={styles.overdueIndicator} />}
            {isDueTomorrowOrToday(item.dueDate) && <View style={styles.dueTomorrowOrTodayIndicator} />}
          </View>
        )}
        <TouchableOpacity onPress={() => deleteTask(item.id)}>
          <Text style={styles.deleteButton}>-</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const showDatePickerHandler = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Task List</Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${calculateCompletionPercentage()}%` },
            ]}
          />
        </View>
        <Text style={styles.completionText}>
          {calculateCompletionPercentage()}% Completed
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task"
          value={task}
          onChangeText={setTask}
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.dateButton} onPress={showDatePickerHandler}>
            <Text style={styles.dateButtonText}>
              {dueDate
                ? `Due: ${dueDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}`
                : 'Select Due Date'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.keyContainer}>
        <View style={styles.keyItem}>
          <View style={styles.overdueIndicator} />
          <Text style={styles.keyText}>Overdue</Text>
        </View>
        <View style={styles.keyItem}>
          <View style={styles.dueTomorrowOrTodayIndicator} />
          <Text style={styles.keyText}>Upcoming Due Date</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.clearButton} onPress={clearAllTasks}>
        <Text style={styles.clearButtonText}>Clear All Tasks</Text>
      </TouchableOpacity>
      {isConfettiVisible && (
        <ConfettiCannon count={200} origin={{ x: 0, y: 0 }} fadeOut={true} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 10,
    color: '#19454b',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    width: '90%',
    height: 20,
    backgroundColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#23395d',
  },
  completionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#23395d',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateButton: {
    width: '72%',
    padding: 8,
    backgroundColor: '#23395d',
    borderRadius: 8,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: 'bold',
  },
  addButton: {
    width: '25%',
    padding: 8,
    backgroundColor: '#4d6788',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 10,
    padding: 10,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkbox: {
    fontSize: 18,
    margin: 10,
  },
  taskDetails: {
    flex: 1,
    marginHorizontal: 8,
  },
  indicatorContainer: {
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskText: {
    fontSize: 16,
    flex: 1,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  dueDateText: {
    fontSize: 12,
    color: '#777',
  },
  deleteButton: {
    color: '#23395d',
    fontWeight: 'bold',
    fontSize: 18,
    margin: 10,
  },
  clearButton: {
    marginTop: 20,
    backgroundColor: '#23395d',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  overdueIndicator: {
    width: 10,
    height: 10,
    backgroundColor: '#e2725b',
    borderRadius: 5,
    margin: 6,
  },
  dueTomorrowOrTodayIndicator: {
    width: 10,
    height: 10,
    backgroundColor: '#fcae1e',
    borderRadius: 5,
    margin: 6,
  },
  keyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  keyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  keyText: {
    margin: 5,
    fontSize: 12,
    color: '#333',
  },
});

export default TodoScreen;
