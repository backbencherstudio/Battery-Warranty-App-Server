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
    title: "Battery Registration Approved",
    message: (data) => `${data.congratulation || 'Congratulations!'} Your battery ${data.batteryName} has been approved`,
    eventType: "BATTERY_APPROVED"
  },
  REJECTED: {
    title: "Battery Registration Rejected",
    message: (data) => `${data.sorry || 'Sorry,'} your battery ${data.batteryName} registration was rejected`,
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
    title: "Warranty Request Approved",
    message: (data) => `${data.congratulation || 'Congratulations!'} Your warranty request for battery ${data.batteryName} has been approved`,
    eventType: "WARRANTY_APPROVED"
  },
  REJECTED: {
    title: "Warranty Request Rejected",
    message: (data) => `${data.sorry || 'Sorry,'} your warranty request for battery ${data.batteryName} was rejected`,
    eventType: "WARRANTY_REJECTED"
  }
}; 