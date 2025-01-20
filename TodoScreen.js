import React, { useState } from 'react';
import {SafeAreaView, TextInput, FlatList, TouchableOpacity, Text, View} from 'react-native';
import { Card } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import ConfettiCannon from 'react-native-confetti-cannon';
import styles from './styles';

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
          <Text style={styles.dueDateText}>Due: {new Date(item.dueDate).toLocaleDateString('en-US', {
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
          <Text style={styles.keyText}>Due Soon</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.clearButton} onPress={clearAllTasks}>
        <Text style={styles.clearButtonText}>CLEAR ALL</Text>
      </TouchableOpacity>
      {isConfettiVisible && (
        <ConfettiCannon count={200} origin={{ x: 0, y: 0 }} fadeOut={true} />
      )}
    </SafeAreaView>
  );
}

export default TodoScreen;
