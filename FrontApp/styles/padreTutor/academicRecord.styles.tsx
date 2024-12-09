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
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
  cellBold: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  cellContainer: {
    flex: 1,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
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
  container: {
    flex: 1,
    backgroundColor: '#d1f7ab',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  editIcon: {
    color: '#6a874d',
  },
  editIconContainer: {
    marginLeft: 5,
  },
  footer: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#6a874d',
    color: '#fff',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
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
  listItem: {
    padding: 15,
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
    marginVertical: 5,
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 20,
  },
  summary: {
    marginTop: 10,
    alignItems: 'center',
  },
  tableContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  tableContainer2: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    width: '100%',
  },
  tableHeader: {
    backgroundColor: '#6a874d',
    borderBottomWidth: 2,
    borderBottomColor: '#4f6b35',
  },
  tableScroll: {
    width: screenWidth - 40,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  totalRow: {
    backgroundColor: '#f0f0f0',
  },
  totalText: {
    fontWeight: 'bold',
    color: '#333',
  },
  userItem: {
    backgroundColor: '#e6f4d6',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    width: '100%',
  },
  userItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default styles;