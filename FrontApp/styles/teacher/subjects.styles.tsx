import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6a874d',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    maxWidth: screenWidth * 0.9,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d1f7ab',
    paddingHorizontal: 20,
    width: '100%',
  },
  editIcon: {
    marginLeft: 10,
    color: '#6a874d',
  },
  editIconContainer: {
    marginLeft: 'auto',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    maxWidth: screenWidth * 0.9,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
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
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#d1f7ab',
    width: '100%',
  },
  subjectItem: {
    backgroundColor: '#6a874d',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    maxWidth: screenWidth * 0.9,
    marginBottom: 10,
  },
  subjectItemText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
});

export default styles;
