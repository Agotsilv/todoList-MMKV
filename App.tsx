import { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';

type Todo = {
  id: number;
  todo: string;
};

export default function App() {
  const [todoListData, setTodoListData] = useMMKVString('todoList');
  const [nome, setNome] = useState('');
  const [contadorId, setContadorId] = useState(1);

  console.log('Conteúdo do todoList:', todoListData);

  const todoListArray: Todo[] = todoListData ? JSON.parse(todoListData) : [];

  const adicionarItem = () => {
    if (nome.trim() !== '') {
      const novoItem: Todo = { id: contadorId, todo: nome };
      const novaLista = [...todoListArray, novoItem];

      // Atualiza o MMKV com a nova lista e incrementa o contador de ID
      setTodoListData(JSON.stringify(novaLista));
      setContadorId(contadorId + 1);
      setNome(''); // Limpa o campo de input após adicionar o item
    } else {
      Alert.alert('Atenção!', 'Por favor informe um nome!')
    }
  };

  // Função para apagar um item da lista
  const apagarItem = (id: number) => {
    const novaLista = todoListArray.filter((item) => item.id !== id);
    setTodoListData(JSON.stringify(novaLista));
  };

  // Função para renderizar cada item do FlatList
  const renderItem = ({ item }: { item: Todo }) => (
    <View style={styles.item}>
      <Text style={styles.nome}>{item.todo}</Text>
      <TouchableOpacity onPress={() => apagarItem(item.id)}>
        <Text style={styles.botaoApagar}>Apagar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.header}> My Todos </Text>
      </View>

      <View style={styles.containerButton}>
        <TextInput
          style={styles.input}
          placeholder='Nome'
          value={nome}
          onChangeText={setNome}
        />
        <TouchableOpacity onPress={adicionarItem} style={styles.button}>
          <Text style={styles.textBtn}> Salvar </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todoListArray}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 32,
    gap: 16
  },
  header: {
    fontSize: 60,
    fontWeight: '700',
    color: '#383737'

  },
  Texto: {
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    width: '100%'
  },
  containerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    borderWidth: 1,
    borderColor: '#757575',
    padding: 5,
    flex: 1,
    marginRight: 5
  },
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 3
  },
  textBtn: {
    color: 'white',
    fontWeight: 'bold'
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  nome: {
    fontSize: 18,
  },
  botaoApagar: {
    backgroundColor: 'red',
    padding: 10,
    fontSize: 16,
    color: 'white',
    marginBottom: 2
  },
});
