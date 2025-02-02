interface NotificationTemplate {
  title: string;
  message: (data: any) => string;
  eventType: string;
}

export const BatteryNotifications = {
  REGISTRATION: {
    title: "New Battery Registration",
    message: (data) => `Battery registration request submitted for ${data.batteryName}`,
    eventType: "BATTERY_REGISTRATION"
  },
  APPROVED: {
    title: "Battery Registration Approved",
    message: (data) => `Congratulations! Your battery ${data.batteryName} has been approved`,
    eventType: "BATTERY_APPROVED"
  },
  REJECTED: {
    title: "Battery Registration Rejected",
    message: (data) => `Sorry, your battery ${data.batteryName} registration was rejected`,
    eventType: "BATTERY_REJECTED"
  }
};

export const WarrantyNotifications = {
  REQUEST: {
    title: "New Warranty Request",
    message: (data) => `Warranty request submitted for battery ${data.batteryName}`,
    eventType: "WARRANTY_REQUEST"
  },
  APPROVED: {
    title: "Warranty Request Approved",
    message: (data) => `Congratulations! Your warranty request for ${data.batteryName} has been approved`,
    eventType: "WARRANTY_APPROVED"
  },
  REJECTED: {
    title: "Warranty Request Rejected",
    message: (data) => `Sorry, your warranty request for ${data.batteryName} was rejected`,
    eventType: "WARRANTY_REJECTED"
  }
}; 