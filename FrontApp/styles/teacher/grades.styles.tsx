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
  buttonCancel: {
    backgroundColor: '#591414'
  },
  buttonConfirm: {
    backgroundColor: '#145919'
  },
  buttonContainer: {
    justifyContent: 'space-between',
    width: '50%'
  },
  buttonDelete: {
    backgroundColor: '#d9534f'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
  cellText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  cellTextRed: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  cellTextGreen: {
    color: 'green',
    fontSize: 16,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },  
  container: {
    flex: 1,
    backgroundColor: '#d1f7ab',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  gradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 5,
  },
  gradeText: {
    fontSize: 16,
    color: '#333',
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
    backgroundColor: '#fff',
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
  modalButton: {
    backgroundColor: '#6a874d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  noDataText: {
    textAlign: 'center',
    color: '#6a874d',
    fontSize: 16,
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  scrollContainer: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: '#d1f7ab',
  },
  selectedText: {
    fontSize: 14,
    color: '#333',
    marginVertical: 10,
  },
  subjectButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
});
export default styles;
