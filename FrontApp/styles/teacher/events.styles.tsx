import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  calendar: {
    width: screenWidth - 40,
    height: 350,
    borderRadius: 10,
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    backgroundColor: '#d1f7ab',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#6a874d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: '#d1f7ab',
  },
  selectedYearText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  yearButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#6a874d',
    borderRadius: 5,
    alignItems: 'center',
  },
  yearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }, 
  yearSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
});

export default styles;
