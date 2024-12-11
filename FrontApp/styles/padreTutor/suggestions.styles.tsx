import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6a874d',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
    width: '90%',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginVertical: 5,
    backgroundColor: '#fcfcfc',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#6a874d',
  },
  removeButton: {
    marginLeft: 10,
    backgroundColor: '#FF6B6B',
    padding: 5,
    borderRadius: 5,
  },
  scrollContainer: {
    backgroundColor: '#d1f7ab',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B4332',
    marginVertical: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default styles;
