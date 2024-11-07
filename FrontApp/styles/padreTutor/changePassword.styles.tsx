import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6a874d',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#d1f7ab',
    alignItems: 'center',
    width: '100%',
  },
  errorMessage: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  eyeIcon: {
    fontSize: 18,
    color: '#6a874d',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#6a874d',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#fff',
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#d1f7ab',
  },
});

export default styles;
