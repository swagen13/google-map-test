import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Button,
  Dimensions,
  Animated,
} from 'react-native';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  AnimatedRegion,
  MarkerPressEvent,
  Geojson,
} from 'react-native-maps';
import MapViewClustering from 'react-native-map-clustering';
import { getDistance } from 'geolib';
import MapViewDirections from 'react-native-maps-directions';
import GetLocation from 'react-native-get-location';
import { MarkerData } from './MarkerData';

export default function App() {
  // const [markers, setMarkers] = useState<any[]>([
  //   {
  //     coordinate: { latitude: 13.7589, longitude: 100.502 },
  //     title: 'ช่างฉาบ',
  //     description: 'สถานที่ 1',
  //     header: 'ช่างฉาบ',
  //     detail: '฿250',
  //     image: require('./assets/plumber.png'),
  //   },
  //   {
  //     coordinate: { latitude: 13.7596, longitude: 100.5025 },
  //     title: 'ช่างไฟ',
  //     description: 'สถานที่ 2',
  //     header: 'ช่างไฟ',
  //     detail: '฿350',
  //     image: require('./assets/plumber.png'),
  //   },
  //   {
  //     coordinate: { latitude: 13.7596, longitude: 100.5035 },
  //     title: 'แม่บ้าน',
  //     description: 'สถานที่ 3',
  //     header: 'แม่บ้าน',
  //     detail: '฿350',
  //     image: require('./assets/cleaner.png'),
  //   },
  //   {
  //     coordinate: { latitude: 13.7581, longitude: 100.5045 },
  //     title: 'ช่างภาพ',
  //     description: 'โรงแรม',
  //     header: 'ช่างภาพ',
  //     detail: '฿1500',
  //     image: require('./assets/photographer.png'),
  //   },
  // ]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [startPoint, setStartPoint] = useState<any>({
    latitude: 13.7589,
    longitude: 100.502,
  });
  const [endPoint, setEndPoint] = useState<any>(null);
  const [distance, setDistance] = useState<any>(null);
  const [duration, setDuration] = useState<any>(null);
  const [animateStartMarker, setAnimateStartMarker] = useState<boolean>(false);
  const [shadow, setShadow] = useState<boolean>(false);
  const [startMarker, setStartMarker] = useState<any>({
    coordinate: { latitude: 13.7589, longitude: 100.502 },
    title: 'ช่างฉาบ',
    description: 'สถานที่ 1',
    header: 'ช่างฉาบ',
    detail: '฿250',
    image: require('./assets/plumber.png'),
  });
  const [center, setCenter] = useState<any>(null);

  const [region, setRegion] = useState({
    latitude: 13.7563,
    longitude: 100.5018,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const [zoomLevel, setZoomLevel] = useState(10);
  const mapRef = useRef<MapView>(null);

  const BANGKOK_LATITUDE = 13.7563;
  const BANGKOK_LONGITUDE = 100.5018;
  const LATITUDE_DELTA = 0.1;
  const LONGITUDE_DELTA = 0.1;

  const generateRandomCoordinates = (numMarkers: number) => {
    const coords = [];
    for (let i = 0; i < numMarkers; i++) {
      const lat = BANGKOK_LATITUDE + (Math.random() - 0.5) * LATITUDE_DELTA * 2;
      const lng =
        BANGKOK_LONGITUDE + (Math.random() - 0.5) * LONGITUDE_DELTA * 2;
      coords.push({
        coordinate: {
          latitude: lat,
          longitude: lng,
        },
        title: `Marker ${i}`,
        description: `This is marker ${i}`,
      });
    }
    return coords;
  };

  const handleMapReady = () => {
    // const newMarkers = generateRandomCoordinates(2);
    setMarkers(MarkerData);
  };

  const handleMarkerPress = (marker: any) => {
    // measure distance between 2 marker
    console.log('marker', markers);

    setEndPoint({
      latitude: marker.latitude,
      longitude: marker.longitude,
    });
  };

  const handleMapPress = (mapEvent: {
    nativeEvent: { coordinate: { latitude: any; longitude: any } };
  }) => {
    // use animate camera to move camera to coordinate
    mapRef.current?.animateCamera(
      {
        center: mapEvent.nativeEvent.coordinate,
        zoom: 16,
      },
      { duration: 1000 }
    );
  };

  const renderMarkers = () => {
    return markers.map((marker, index) => {
      return (
        <Marker
          key={`marker-${index}`}
          coordinate={marker.coordinate}
          title={marker.title}
          description={marker.description}
          onPress={() => handleMarkerPress(marker.coordinate)}
        >
          <View style={styles.customMarker}>
            <Image source={marker.image} style={styles.markerImage} />
            <View style={styles.markerContent}>
              <Text style={styles.markerHeader}>{marker.header}</Text>
              <Text style={styles.markerDetail}>{marker.detail}</Text>
            </View>
          </View>
        </Marker>
      );
    });
  };

  const myPlace = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [BANGKOK_LATITUDE, BANGKOK_LONGITUDE],
        },
      },
    ],
  };

  // const renderCluster = (cluster: { geometry: any; properties: any }) => {
  //   const { geometry, properties } = cluster;
  //   const { point_count } = properties;

  //   return (
  //     <Marker
  //       coordinate={{
  //         latitude: geometry.coordinates[1],
  //         longitude: geometry.coordinates[0],
  //       }}
  //       onPress={() => {
  //         // zoom same MapViewClustering
  //         mapRef.current?.animateCamera(
  //           {
  //             center: {
  //               latitude: geometry.coordinates[1],
  //               longitude: geometry.coordinates[0],
  //             },
  //             zoom: zoomLevel + 2,
  //           },
  //           { duration: 1000 }
  //         );

  //         setZoomLevel(zoomLevel + 2);
  //       }}
  //     >
  //       <View
  //         style={{
  //           backgroundColor: '#E62822',
  //           borderRadius: 20,
  //           width: 40,
  //           height: 40,
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //           borderColor: 'white',
  //           borderWidth: 2,
  //         }}
  //         key={point_count}
  //       >
  //         <Text
  //           style={{
  //             color: 'white',
  //             fontSize: 12,
  //           }}
  //         >
  //           {point_count} x
  //         </Text>
  //       </View>
  //     </Marker>
  //   );
  // };
  // useEffect(() => {
  //   // console log detail of location
  //   console.log('center', center);
  //   // Will change fadeAnim value to 1 in 5 seconds
  //   Animated.timing(fadeAnim, {
  //     toValue: 1,
  //     duration: 5000,
  //     useNativeDriver: true,
  //   }).start();
  // }, [center]);

  const GOOGLE_MAPS_APIKEY = 'AIzaSyApSQ6aKx3a3HDucnIKyG_FmcnVb3wQrms';
  const { width, height } = Dimensions.get('window');
  const animatedValue = useRef(new Animated.Value(0)).current;
  // fadeAnim will be used as the value for opacity. Initial Value: 0
  const shadowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animateStartMarker) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      Animated.timing(shadowOpacity, {
        toValue: 0.5,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
      Animated.timing(shadowOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
    if (animateStartMarker) {
      setTimeout(() => {
        setShadow(true);
      }, 200);
    } else {
      setTimeout(() => {
        setShadow(false);
      }, 200);
    }
  }, [animateStartMarker]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5],
  });

  return (
    <View style={styles.container}>
      <MapViewClustering
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: BANGKOK_LATITUDE,
          longitude: BANGKOK_LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        // onPress={handleMapPress}
        zoomControlEnabled={true}
        zoomEnabled={true}
        onMapReady={handleMapReady}
        ref={mapRef}
        clusterColor="#E62822"
        clusterTextColor="white"
        showsUserLocation={true}
        showsMyLocationButton={true}
        userLocationAnnotationTitle="You are here"
        onRegionChangeComplete={() => {
          setRegion;
          setAnimateStartMarker(false);
        }}
        onRegionChange={() => setAnimateStartMarker(true)}
        // custom text in cluster
        // renderCluster={renderCluster}
      >
        {/* {center && <Marker coordinate={center} />} */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            image={marker.image}
            onPress={() => handleMarkerPress(marker.coordinate)}
            style={{
              width: 20,
              height: 20,
            }}
          />
        ))}

        <MapViewDirections
          mode="DRIVING"
          origin={center}
          destination={endPoint}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={5}
          strokeColor="hotpink"
          optimizeWaypoints={true}
          onStart={(params) => {
            console.log(
              `Started routing between "${params.origin}" and "${params.destination}"`
            );
          }}
          onReady={(result) => {
            console.log(`Distance: ${result.distance} km`);
            console.log(`Duration: ${result.duration} min.`);

            // show distance and duration on map

            mapRef.current?.fitToCoordinates(result.coordinates, {
              edgePadding: {
                right: width / 20,
                bottom: height / 20,
                left: width / 20,
                top: height / 20,
              },
            });
          }}
          onError={(errorMessage) => {
            // console.log('GOT AN ERROR');
          }}
        />

        {/* {renderMarkers()} */}
      </MapViewClustering>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          pointerEvents: 'none',
        }}
      >
        {shadow && (
          <Animated.Image
            source={require('./assets/shadow.png')}
            style={{
              width: 20,
              height: 20,
              resizeMode: 'contain',
              opacity: shadowOpacity,
              marginTop: 35,
              transform: [{ translateY: translateY }],
            }}
          />
        )}
        <Animated.Image
          source={require('./assets/map_pin_icon.png')}
          style={{
            width: 30,
            height: 30,
            resizeMode: 'contain',
            transform: [{ translateY: translateY }],
            position: 'absolute',
          }}
        />
      </View>

      <StatusBar
        style="auto"
        backgroundColor="transparent"
        translucent={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  customMarker: {
    flexDirection: 'column',
    alignItems: 'center',
    // backgroundColor: 'white',
    borderRadius: 8,
  },
  markerImage: {
    width: 35,
    height: 35,
    // marginRight: 10,
  },
  markerContent: {
    flex: 1,
    alignItems: 'center',
  },
  markerHeader: {
    fontSize: 12,
  },
  markerDetail: {
    fontSize: 12,
    marginTop: 4,
  },
  fadingContainer: {
    padding: 20,
    backgroundColor: 'powderblue',
  },
});
