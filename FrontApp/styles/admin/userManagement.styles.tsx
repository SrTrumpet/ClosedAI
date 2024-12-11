import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6a874d',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '90%',
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  container: {
    flexGrow: 1,
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
    paddingVertical: 19,
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
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fcfcfc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '90%',
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#1B4332',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#d1f7ab',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B4332',
    textAlign: 'center',
    marginVertical: 20, 
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1B4332',
    textAlign: 'center',
    marginTop: 70,
  },
  userItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userItemText: {
    fontSize: 18,
    color: '#1B4332',
    flex: 1,
  },
});

export default styles;