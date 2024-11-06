// App.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default function App() {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [editarId, setEditarId] = useState(null);

  // Cargar las tareas al iniciar la aplicación
  useEffect(() => {
    obtenerTareas();
  }, []);

  // Obtener todas las tareas
  const obtenerTareas = async () => {
    try {
      const response = await fetch('http://localhost:3000/tareas');
      const data = await response.json();
      setTareas(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Agregar una nueva tarea
const agregarTarea = async () => {
  // Validar que el título no esté vacío
  if (titulo.trim() === '') {
    alert('Por favor, ingrese un título para la tarea.');
    return; // Salir de la función si el título es vacío
  }

  try {
    await fetch('http://localhost:3000/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo }),
    });
    setTitulo(''); // Limpiar el campo de entrada
    obtenerTareas(); // Volver a cargar las tareas
  } catch (error) {
    console.error(error);
  }
};

// Actualizar una tarea
const actualizarTarea = async () => {
  // Validar que el título no esté vacío
  if (titulo.trim() === '') {
    alert('Por favor, ingrese un título para la tarea.');
    return; // Salir de la función si el título es vacío
  }

  try {
    await fetch(`http://localhost:3000/tareas/${editarId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo }),
    });
    setTitulo(''); // Limpiar el campo de entrada
    setEditarId(null); // Resetear el estado de edición
    obtenerTareas(); // Volver a cargar las tareas
  } catch (error) {
    console.error(error);
  }
};

  // Eliminar una tarea
  const eliminarTarea = async (id) => {
    try {
      await fetch(`http://localhost:3000/tareas/${id}`, { method: 'DELETE' });
      obtenerTareas();
    } catch (error) {
      console.error(error);
    }
  };

  // Preparar para editar una tarea
  const editarTarea = (tarea) => {
    setTitulo(tarea.titulo);
    setEditarId(tarea.id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Tareas</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe una tarea"
        value={titulo}
        onChangeText={setTitulo}
      />
      <Button
        title={editarId ? 'Actualizar Tarea' : 'Agregar Tarea'}
        onPress={editarId ? actualizarTarea : agregarTarea}
      />
      <FlatList
        data={tareas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.titulo}</Text>
            <TouchableOpacity onPress={() => editarTarea(item)}>
              <Text style={styles.editButton}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => eliminarTarea(item.id)}>
              <Text style={styles.deleteButton}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderColor: '#ccc', borderWidth: 1, padding: 8, marginBottom: 10 },
  itemContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  itemText: { fontSize: 18 },
  editButton: { color: 'blue', marginRight: 10 },
  deleteButton: { color: 'red' },
});
