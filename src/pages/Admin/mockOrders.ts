import type { LatLng } from "../../lib/distance";

/** Mock data for the admin dashboard — replace with useGetOrdersQuery once the
 *  orders API returns customer coordinates. */

export const ADMIN_PLACE: { name: string; location: LatLng } = {
  name: "Local Mart Store, Ganeshguri, Guwahati",
  location: { lat: 26.1490, lng: 91.7870 },
};

export interface MockOrder {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  location: LatLng;
  itemCount: number;
  total: number;
  placedAt: number; // epoch ms
  read: boolean;
}

const minsAgo = (m: number) => Date.now() - m * 60_000;

export const seedOrders = (): MockOrder[] => [
  {
    id: "LM-1042",
    customerName: "Mridusmita Baruah",
    phone: "98300 11122",
    address: "House 12, Beltola Tiniali, Guwahati, Assam 781028",
    location: { lat: 26.1250, lng: 91.8000 },
    itemCount: 6,
    total: 842,
    placedAt: minsAgo(2),
    read: false,
  },
  {
    id: "LM-1041",
    customerName: "Dipankar Das",
    phone: "98310 33445",
    address: "5 Six Mile, Khanapara, Guwahati, Assam 781022",
    location: { lat: 26.1380, lng: 91.8040 },
    itemCount: 3,
    total: 415,
    placedAt: minsAgo(9),
    read: false,
  },
  {
    id: "LM-1040",
    customerName: "Parvati Gogoi",
    phone: "98740 55667",
    address: "88 Paltan Bazaar, Guwahati, Assam 781008",
    location: { lat: 26.1830, lng: 91.7490 },
    itemCount: 11,
    total: 1960,
    placedAt: minsAgo(26),
    read: true,
  },
  {
    id: "LM-1039",
    customerName: "Rajib Kalita",
    phone: "90070 77889",
    address: "3 Jalukbari, Guwahati, Assam 781014",
    location: { lat: 26.1630, lng: 91.6600 },
    itemCount: 4,
    total: 590,
    placedAt: minsAgo(71),
    read: true,
  },
];

const NEW_ORDER_POOL: Omit<MockOrder, "id" | "placedAt" | "read">[] = [
  {
    customerName: "Nandini Sarma",
    phone: "98360 99001",
    address: "41 Chandmari, Guwahati, Assam 781003",
    location: { lat: 26.1690, lng: 91.7720 },
    itemCount: 5,
    total: 678,
  },
  {
    customerName: "Kabir Ahmed",
    phone: "98051 22334",
    address: "7 Hatigaon, Guwahati, Assam 781038",
    location: { lat: 26.1290, lng: 91.7960 },
    itemCount: 2,
    total: 260,
  },
  {
    customerName: "Bhaswati Hazarika",
    phone: "97480 44556",
    address: "19 Narengi, Guwahati, Assam 781171",
    location: { lat: 26.1760, lng: 91.8250 },
    itemCount: 8,
    total: 1235,
  },
];

let counter = 1042;
export const makeNewOrder = (): MockOrder => {
  counter += 1;
  const pick = NEW_ORDER_POOL[counter % NEW_ORDER_POOL.length];
  return { ...pick, id: `LM-${counter}`, placedAt: Date.now(), read: false };
};
