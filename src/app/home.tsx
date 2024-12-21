/* eslint-disable react-hooks/exhaustive-deps */
import { Categories } from '@/components/Categories';
import { Places } from '@/components/Places';
import { api } from '@/libs/api';
import { colors, fontFamily } from '@/styles/theme';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';

export type Category = {
  id: string;
  name: string;
};

export type Place = {
  id: string;
  name: string;
  description: string;
  coupons: number;
  cover: string;
  address: string;
  latitude: number;
  longitude: number;
};

type Market = Place;

const currentLocation = {
  latitude: -23.561187293883442,
  longitude: -46.656451388116494,
};

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState('');
  const [markets, setMarkets] = useState<Market[]>([]);
  const [render, setRender] = useState(false);

  async function fetchCategories() {
    try {
      const { data } = await api.get<Category[]>('/categories');
      setCategories(data);
      setCategory(data[0].id);
    } catch (error) {
      console.log(error);
      Alert.alert('Categorias', 'Não foi possível carregar as categorias.');
    }
  }

  async function fetchMarkets() {
    try {
      if (!category) {
        return;
      }

      const { data } = await api.get<Market[]>('/markets/category/' + category);
      setMarkets(data);
    } catch (error) {
      console.log(error);
      Alert.alert('Locais', 'Não foi possível carregar os locais.');
    }
  }

  // async function getCurrentLocation() {
  //   try {
  //     const { granted } = await Location.requestForegroundPermissionsAsync();

  //     if (granted) {
  //       const location = await Location.getCurrentPositionAsync();
  //       console.log(location);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchMarkets();
  }, [category]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRender(true);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Categories
        data={categories}
        onSelect={setCategory}
        selected={category}
      />

      <View style={{ flex: 1, backgroundColor: colors.gray[200] }}>
        <MapView
          style={{ width: '100%', height: '100%' }}
          initialRegion={{
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }}
        >
          <Marker
            identifier="current"
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            image={require('@/assets/location.png')}
          />

          {markets.map((item) => (
            <Marker
              key={item.id}
              identifier={item.id}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              image={require('@/assets/pin.png')}
            >
              <Callout onPress={() => router.navigate(`/market/${item.id}`)}>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.gray[600],
                      fontFamily: fontFamily.medium,
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.gray[600],
                      fontFamily: fontFamily.regular,
                    }}
                  >
                    {item.address}
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>
      {render && <Places data={markets} />}
    </View>
  );
}
