import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6a874d',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cell: {
    padding: 12,
    justifyContent: 'center',
    minWidth: 120,
  },
  cellText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#d1f7ab',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#6a874d',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    color: '#333',
    backgroundColor: '#fff',
  },
  modalButton: {
    backgroundColor: '#6a874d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  scrollContainer: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: '#d1f7ab',
  },
  subjectButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  tableContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tableHeader: {
    backgroundColor: '#6a874d',
    borderBottomWidth: 2,
    borderBottomColor: '#4f6b35',
  },
  tableScroll: {
    width: screenWidth - 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default styles;