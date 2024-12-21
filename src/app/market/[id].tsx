/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { Coupon } from '@/components/Market/Coupon';
import { Cover } from '@/components/Market/Cover';
import { Details } from '@/components/Market/Details';
import { api } from '@/libs/api';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Modal, View, ScrollView } from 'react-native';

export type Details = {
  cover: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  coupons: number;
  rules: {
    id: string;
    description: string;
  }[];
};

export default function Market() {
  const [data, setData] = useState<Details | null>(null);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [couponIsFetching, setCouponIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisibleCameraModal, setIsVisibleCameraModal] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, requestPermission] = useCameraPermissions();

  const params = useLocalSearchParams<{ id: string }>();
  console.log(params.id);

  const qrLock = useRef(false);

  async function fetchMarket() {
    try {
      const { data } = await api.get<Details>(`/markets/${params.id}`);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível carregar os dados.', [
        {
          text: 'Ok',
          onPress: () => router.back(),
        },
      ]);
    }
  }

  async function handleOpenCamera() {
    try {
      const { granted } = await requestPermission();

      if (!granted) {
        return Alert.alert('Câmera', 'Você precisa habilitar o uso da câmera');
      }

      qrLock.current = false;
      setIsVisibleCameraModal(true);
    } catch (error) {
      console.log(error);
      Alert.alert('Câmera', 'Não foi possível utulizar a câmera');
    }
  }

  async function getCoupon(id: string) {
    try {
      setCouponIsFetching(true);

      const { data } = await api.patch('/coupons/' + id);
      Alert.alert('Cupom', data.coupon);
      setCoupon(data.coupon);
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível utilizar o cupom');
    } finally {
      setCouponIsFetching(false);
    }
  }

  function handleUseCoupon(id: string) {
    setIsVisibleCameraModal(false);

    Alert.alert(
      'Cupom',
      'Não é possível reutilizar um cupom resgatado. Deseja realmente resgatar o cupom?',
      [
        {
          style: 'cancel',
          text: 'Não',
        },
        {
          text: 'Sim',
          onPress: () => getCoupon(id),
        },
      ]
    );
  }

  useEffect(() => {
    fetchMarket();
  }, [params.id, coupon]);

  if (isLoading) {
    return <Loading />;
  }

  if (!data) {
    return <Redirect href="/home" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Cover uri={data.cover} />

        <Details details={data} />

        {coupon && <Coupon code={coupon} />}
      </ScrollView>

      <View style={{ padding: 32 }}>
        <Button onPress={handleOpenCamera}>
          <Button.Title>Ler QR Code</Button.Title>
        </Button>
      </View>

      <Modal style={{ flex: 1 }} visible={isVisibleCameraModal}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={({ data }) => {
            if (data && !qrLock.current) {
              qrLock.current = true;
              setTimeout(() => {
                handleUseCoupon(data);
              }, 500);
            }
          }}
        />

        <View style={{ position: 'absolute', bottom: 32, left: 32, right: 32 }}>
          <Button
            onPress={() => setIsVisibleCameraModal(false)}
            isLoading={couponIsFetching}
          >
            <Button.Title>Voltar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
}
