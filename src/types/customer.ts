/** A saved delivery destination for a Talha Garments customer. */
export interface DeliveryAddress {
  recipientName: string;
  phone: string;
  addressLine: string;
  area: string;
  city: string;
  deliveryInstructions?: string;
}

/** Customer contact details and delivery addresses saved for future orders. */
export interface CustomerProfile {
  name: string;
  email: string;
  phone: string;
  savedAddresses: DeliveryAddress[];
}
