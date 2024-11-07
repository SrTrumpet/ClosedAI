import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6a874d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    width: '90%',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#d1f7ab',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  editIcon: {
    marginLeft: 10,
  },
  editIconContainer: {
    marginLeft: 'auto',
  },
  header: {
    width: '100%',
    backgroundColor: '#6a874d',
    paddingVertical: 16,
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  headerText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#d1f7ab',
  },
  subtitle: {
    fontSize: 20,
    color: '#1B4332',
    textAlign: 'center',
    marginTop: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1B4332',
    textAlign: 'center',
    marginTop: 70,
  },
});

export default styles;