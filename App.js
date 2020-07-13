import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    FlatList,
    Image
} from 'react-native';
import axios from 'axios'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start'
    },
    mainTitle: {
        textAlign: 'center',
        fontFamily: 'sans-serif',
        fontSize: 22,
        paddingTop: 15,
        flex: 1
    },
    searchInput: {
        borderRadius: 50,
        borderColor: '#000',
        borderWidth: 1,
        height: 45,
        fontSize: 16,
        paddingLeft: 10,
        marginTop: 5,
    },
    place: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 5,
        paddingLeft: 15,
        paddingRight: 15
    },
    image: {
        flex: 1,
        height: 100,
        width: 100
    },
    mapImage: {
      flex: 10,
      width: undefined,
      height: undefined
    },
    textContainer: {
        padding: 7,
        justifyContent: 'center',
        flex: 2,
        borderLeftColor: '#000',
        borderLeftWidth: 5
    },
    placeText: {
        fontFamily: 'sans-serif-condensed',
        fontSize: 16,
        textAlign: 'center'
    }
})

export default class extends Component {
    handleSearch = (text) => {
      this.setState({search: true})
      const matches = this.state.places.filter(place => place.name.toLowerCase().indexOf(text.toLowerCase()) > -1)
      this.setState({matches})
    }
    placeElement = ({item}) => (
      <View style={styles.place}>
          <View style={styles.textContainer}>
            <Text style={styles.placeText}>{item.name}</Text>
          </View>
          <Image style={styles.image} source={{uri: item.img}}/>
      </View>
    )
    renderResults = () => {
        if(this.state.search) {
            return(
                <View style={{flex: 8, flexDirection: 'row'}}>
                  <FlatList
                    data={this.state.matches}
                    renderItem={item => this.placeElement(item)}
                    keyExtractor={item => item.key}
                    numColumns={1}
                />
                </View>
            )
        }
    }
    state = {
        search: false,
        places: [],
        matches: []
    }
    renderInitialElements = () => {
        if(!this.state.search) {
            return (
                <View style={{flex: 3}}>
                    <Image style={styles.mapImage} source={{uri: 'https://image.freepik.com/vector-gratis/diseno-plano-lupa-sobre-mapa-mundo_1010-444.jpg'}}/>
                    <Text style={styles.mainTitle}>Directorio de ubicaciones</Text>
                </View>
            )
        }
    }
    componentDidMount = () => {
      axios.get('http://www.mapquestapi.com/search/v2/radius?units=km&radius=4000&key=E4g4CQDntEOjMsvy9QAJ4o3Z9FKS8w4y&maxMatches=50&origin=39.750307,-104.999472')
        .then((response) => {
            try {
              const places = response.data.searchResults.map((value, index) => {
                value.img = `https://picsum.photos/id/${index+75}/100`
                return value
              })
              this.setState({places}, () => {
                console.log('ya')
              })
            }
            catch(err) {
                console.log('Error al procesar la petición >>', err)
            }
        })
        .catch((response) => {
            console.log('Error en la petición >>', response)
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    {this.renderInitialElements()}
                    <View style={{...styles.container, paddingLeft: 20, paddingRight: 20}}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar ubicaciones"
                            onChangeText={text => this.handleSearch(text)}
                        />
                    </View>
                </View>
                {this.renderResults()}
            </View>
        )
    }
}