interface NotificationTemplate {
  title: string;
  message: (data: any) => string;
  eventType: string;
}

export const BatteryNotifications = {
  REGISTRATION: {
    title: "New Battery Registration",
    message: (data) => `New battery registration request for ${data.batteryName}`,
    eventType: "BATTERY_REGISTRATION"
  },
  APPROVED: {
    title: "Enregistrement de la batterie approuvé",
    message: (data) => `Félicitations! Votre batterie ${data.batteryName} a été approuvée.`,
    eventType: "BATTERY_APPROVED"
  },
  REJECTED: {
    title: "Enregistrement de la batterie rejeté",
    message: (data) => `Désolé, l'enregistrement de votre batterie ${data.batteryName} a été rejeté`,
    eventType: "BATTERY_REJECTED"
  }
};

export const WarrantyNotifications = {
  REQUEST: {
    title: "New Warranty Request",
    message: (data) => `New warranty request for battery ${data.batteryName}`,
    eventType: "WARRANTY_REQUEST"
  },
  APPROVED: {
    title: "Demande de garantie approuvée",
    message: (data) => `Félicitations! Votre demande de garantie pour la batterie ${data.batteryName} a été approuvée.`,
    eventType: "WARRANTY_APPROVED"
  },
  REJECTED: {
    title: "Demande de garantie rejetée",
    message: (data) => `Désolé, votre demande de garantie pour la batterie ${data.batteryName} a été rejetée.`,
    eventType: "WARRANTY_REJECTED"
  }
  
}; 